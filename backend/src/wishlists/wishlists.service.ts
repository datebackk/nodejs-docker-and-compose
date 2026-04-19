import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { UserRequest } from 'src/auth/types/auth-request';
import { WishlistDto } from './dto/wishlist.dto';
import { toArrayDto, toDto } from '../utils';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  public async findAll(): Promise<WishlistDto[]> {
    const wishlists = await this.wishlistRepository.find({
      relations: ['owner'],
    });

    return toArrayDto(WishlistDto, wishlists);
  }

  public async create(
    createWishlistDto: CreateWishlistDto,
    currentUser: UserRequest,
  ): Promise<WishlistDto> {
    const items = createWishlistDto.itemsId.length
      ? await this.wishRepository.find({
          where: createWishlistDto.itemsId.map((id) => ({ id })),
        })
      : [];

    const wishlist = await this.wishlistRepository.save({
      name: createWishlistDto.name,
      image: createWishlistDto.image,
      owner: { id: currentUser.id },
      items,
    });

    return toDto(WishlistDto, wishlist);
  }

  public async findOne(id: number): Promise<WishlistDto> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException();
    }

    return toDto(WishlistDto, wishlist);
  }

  public async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    currentUser: UserRequest,
  ): Promise<WishlistDto> {
    const wishlist = await this.findOne(id);

    if (wishlist.owner.id !== currentUser.id) {
      throw new ForbiddenException('Нельзя обновить чужой вишлист');
    }

    if (updateWishlistDto.itemsId) {
      const items = await this.wishRepository.find({
        where: updateWishlistDto.itemsId.map((id) => ({ id })),
      });

      await this.wishlistRepository.save({ id, items });
    }

    await this.wishlistRepository.update(
      { id },
      {
        name: updateWishlistDto.name,
        image: updateWishlistDto.image,
      },
    );

    return this.findOne(id);
  }

  public async removeOne(
    id: number,
    currentUser: UserRequest,
  ): Promise<WishlistDto> {
    const wishlist = await this.findOne(id);

    if (wishlist.owner.id !== currentUser.id) {
      throw new ForbiddenException('Нельзя удалить чужой вишлист');
    }

    await this.wishlistRepository.delete({ id });

    return wishlist;
  }
}
