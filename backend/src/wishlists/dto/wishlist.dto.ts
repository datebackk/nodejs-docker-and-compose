import {
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { UserPublicProfileResponseDto } from '../../users/dto/user-public-profile-response.dto';
import { WishPartialDto } from '../../wishes/dto/wish-partial.dto';

export class WishlistDto {
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
  @IsUrl()
  image: string;

  @Expose()
  @Type(() => UserPublicProfileResponseDto)
  owner: UserPublicProfileResponseDto;

  @Expose()
  @IsArray()
  @Type(() => WishPartialDto)
  items: WishPartialDto[];
}
