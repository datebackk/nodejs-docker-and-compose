import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateWishlistDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  itemsId?: number[];
}
