import {
  IsDate,
  IsEmail,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Expose } from 'class-transformer';

export class SignupUserResponseDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  @MinLength(1)
  username: string;

  @Expose()
  @IsString()
  about: string;

  @Expose()
  @IsString()
  avatar: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsDate()
  createdAt: Date;

  @Expose()
  @IsDate()
  updatedAt: Date;
}
