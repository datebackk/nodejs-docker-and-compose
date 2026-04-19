import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UserRequest } from 'src/auth/types/auth-request';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from '../wishes/entities/wish.entity';
import { Repository } from 'typeorm';
import { OfferDto } from './dto/offer.dto';
import { toArrayDto, toDto } from '../utils';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  public async create(
    createOfferDto: CreateOfferDto,
    currentUser: UserRequest,
  ): Promise<OfferDto> {
    const wish = await this.wishRepository.findOne({
      where: { id: createOfferDto.itemId },
      relations: ['owner'],
    });

    if (!wish) throw new NotFoundException();

    if (wish.owner.id === currentUser.id) {
      throw new ForbiddenException(
        'Нельзя вносить деньги на собственные подарки',
      );
    }

    if (wish.raised >= wish.price) {
      throw new UnprocessableEntityException(`Необходимая сумма уже собрана`);
    }

    if (wish.raised + createOfferDto.amount > wish.price) {
      throw new UnprocessableEntityException(
        `Сумма собранных средств превысит стоимость подарка, можно внести сумму до ${
          wish.price - wish.raised
        }`,
      );
    }

    const offer = await this.offerRepository.save({
      ...createOfferDto,
      user: { id: currentUser.id },
      item: { id: createOfferDto.itemId },
    });

    await this.wishRepository.increment(
      { id: createOfferDto.itemId },
      'raised',
      createOfferDto.amount,
    );

    return toDto(OfferDto, offer);
  }

  public async findAll(currentUser: UserRequest): Promise<OfferDto[]> {
    const offers = await this.offerRepository.find({
      where: { user: { id: currentUser.id } },
      relations: ['item', 'user'],
    });

    return toArrayDto(OfferDto, offers);
  }

  public async findOne(id: number): Promise<OfferDto> {
    const offer = await this.offerRepository.findOne({
      where: { id: id },
      relations: ['item', 'user'],
    });

    if (!offer) {
      throw new NotFoundException();
    }

    return toDto(OfferDto, offer);
  }
}
