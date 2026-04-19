import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { OfferDto } from '../../offers/dto/offer.dto';

export class UserWishesDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;

  @Expose()
  @IsString()
  @Length(1, 250)
  name: string;

  @Expose()
  @IsString()
  link: string;

  @Expose()
  @IsString()
  image: string;

  @Expose()
  @IsNumber()
  @Min(1)
  price: number;

  @Expose()
  @IsNumber()
  @Min(1)
  raised: number;

  @Expose()
  @IsNumber()
  copied: number;

  @Expose()
  @IsString()
  @Length(1, 2024)
  description: string;

  @Expose()
  @IsArray()
  @Type(() => OfferDto)
  offers: OfferDto[];
}
