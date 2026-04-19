import {
  IsDate,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';
import { Expose } from 'class-transformer';

export class WishPartialDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsString()
  @Length(1, 250)
  name: string;

  @Expose()
  @IsUrl()
  link: string;

  @Expose()
  @IsUrl()
  image: string;

  @Expose()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  price: number;

  @Expose()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  raised: number;

  @Expose()
  @IsString()
  @Length(1, 1024)
  description: string;
}
