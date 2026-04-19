import { IsString, MinLength } from 'class-validator';

export class SigninUserDto {
  @IsString()
  @MinLength(2)
  username: string;

  @IsString()
  @MinLength(2)
  password: string;
}
