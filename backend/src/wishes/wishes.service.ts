import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { Wish } from './entities/wish.entity';
import { UpdateWishDto } from './dto/update-wish.dto';
import { UserRequest } from '../auth/types/auth-request';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { WishDto } from './dto/wish.dto';
import { WishPartialDto } from './dto/wish-partial.dto';
import { toArrayDto, toDto } from '../utils';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  public async create(
    createWishDto: CreateWishDto,
    currentUser: UserRequest,
  ): Promise<WishDto> {
    const wish = await this.wishRepository.save({
      ...createWishDto,
      owner: { id: currentUser.id },
    });

    return toDto(WishDto, wish);
  }

  public async findLast(): Promise<WishPartialDto[]> {
    const wishes = await this.wishRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
      relations: ['owner', 'offers'],
    });

    return toArrayDto(WishPartialDto, wishes);
  }

  public async findTop(): Promise<WishPartialDto[]> {
    const wishes = await this.wishRepository.find({
      order: { copied: 'DESC' },
      take: 10,
      relations: ['owner', 'offers'],
    });

    return toArrayDto(WishPartialDto, wishes);
  }

  public async findOne(id: number, currentUser: UserRequest): Promise<WishDto> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });

    if (!wish) {
      throw new NotFoundException();
    }

    if (wish.owner.id !== currentUser?.id) {
      wish.offers.forEach((value) => {
        if (value.hidden) {
          value.amount = 0;
        }
      });
    }

    return toDto(WishDto, wish);
  }

  public async update(
    id: number,
    updateWishDto: UpdateWishDto,
    currentUser: UserRequest,
  ): Promise<WishDto> {
    const wish = await this.findOneWish(id);

    if (wish.owner.id !== currentUser.id) {
      throw new ForbiddenException('Нельзя обновить чужое пожелание');
    }

    if (wish.raised > 0 && updateWishDto.price != wish.price) {
      throw new ForbiddenException(
        'Нельзя обновить цену если кто-то уже вложился',
      );
    }

    await this.wishRepository.update({ id }, updateWishDto);

    return this.findOneWish(id);
  }

  public async removeOne(
    id: number,
    currentUser: UserRequest,
  ): Promise<WishDto> {
    const wish = await this.findOneWish(id);

    if (wish.owner.id !== currentUser.id) {
      throw new ForbiddenException('Нельзя удалить чужое пожелание');
    }

    await this.wishRepository.delete({ id });

    return wish;
  }

  public async copyWish(
    id: number,
    currentUser: UserRequest,
  ): Promise<WishDto> {
    const wish = await this.findOneWish(id);

    if (wish.owner.id === currentUser.id) {
      throw new ForbiddenException('Нельзя скопировать собсственное пожелание');
    }

    const copy = await this.wishRepository.save({
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
      owner: { id: currentUser.id },
    });

    await this.wishRepository.increment({ id: wish.id }, 'copied', 1);

    return toDto(WishDto, copy);
  }

  private async findOneWish(id: number): Promise<WishDto> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });

    if (!wish) {
      throw new NotFoundException();
    }

    return toDto(WishDto, wish);
  }
}
