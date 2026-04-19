import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthRequest } from '../auth/types/auth-request';
import { OfferDto } from './dto/offer.dto';

@Controller('offers')
@UseGuards(AuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  public findAll(@Request() req: AuthRequest): Promise<OfferDto[]> {
    return this.offersService.findAll(req.user);
  }

  @Get(':id')
  public findOne(@Param('id') id: string): Promise<OfferDto> {
    return this.offersService.findOne(parseInt(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public create(
    @Request() req: AuthRequest,
    @Body() createOfferDto: CreateOfferDto,
  ): Promise<OfferDto> {
    return this.offersService.create(createOfferDto, req.user);
  }
}
