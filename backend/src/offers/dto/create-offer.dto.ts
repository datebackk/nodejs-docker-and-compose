import { IsBoolean, IsNumber, Min } from 'class-validator';

export class CreateOfferDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  amount: number;

  @IsBoolean()
  hidden: boolean;

  @IsNumber()
  itemId: number;
}
