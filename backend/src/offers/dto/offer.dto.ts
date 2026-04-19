import { IsBoolean, IsDate, IsNumber, Min } from 'class-validator';
import { WishDto } from '../../wishes/dto/wish.dto';
import { Expose, Type } from 'class-transformer';
import { UserPublicProfileResponseDto } from '../../users/dto/user-public-profile-response.dto';

export class OfferDto {
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
  @Type(() => WishDto)
  item: WishDto;

  @Expose()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @Expose()
  @IsBoolean()
  hidden: boolean;

  @Expose()
  @Type(() => UserPublicProfileResponseDto)
  user: UserPublicProfileResponseDto;
}
