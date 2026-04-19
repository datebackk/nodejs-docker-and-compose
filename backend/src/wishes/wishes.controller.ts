import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthRequest } from '../auth/types/auth-request';
import { WishDto } from './dto/wish.dto';
import { WishPartialDto } from './dto/wish-partial.dto';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  public create(
    @Request() req: AuthRequest,
    @Body() createWishDto: CreateWishDto,
  ): Promise<WishDto> {
    return this.wishesService.create(createWishDto, req.user);
  }

  @Get('last')
  public findLast(): Promise<WishPartialDto[]> {
    return this.wishesService.findLast();
  }

  @Get('top')
  public findTop(): Promise<WishPartialDto[]> {
    return this.wishesService.findTop();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  public findOne(
    @Request() req: AuthRequest,
    @Param('id') id: number,
  ): Promise<WishDto> {
    return this.wishesService.findOne(id, req.user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  public update(
    @Request() req: AuthRequest,
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<WishDto> {
    return this.wishesService.update(id, updateWishDto, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  public removeOne(
    @Request() req: AuthRequest,
    @Param('id') id: number,
  ): Promise<WishDto> {
    return this.wishesService.removeOne(id, req.user);
  }

  @Post(':id/copy')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard)
  public copyWish(
    @Request() req: AuthRequest,
    @Param('id') id: number,
  ): Promise<WishDto> {
    return this.wishesService.copyWish(id, req.user);
  }
}
