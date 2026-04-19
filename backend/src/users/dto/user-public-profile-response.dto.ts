import { IsDate, IsNumber, IsString, Length } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserPublicProfileResponseDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  @Length(2, 30)
  username: string;

  @Expose()
  @IsString()
  about: string;

  @Expose()
  @IsString()
  avatar: string;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;
}
