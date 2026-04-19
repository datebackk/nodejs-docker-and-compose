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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthRequest } from '../auth/types/auth-request';
import { WishlistDto } from './dto/wishlist.dto';

@Controller('wishlistlists')
@UseGuards(AuthGuard)
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  public findAll(): Promise<WishlistDto[]> {
    return this.wishlistsService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public create(
    @Request() req: AuthRequest,
    @Body() createWishlistDto: CreateWishlistDto,
  ): Promise<WishlistDto> {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Get(':id')
  public findOne(@Param('id') id: number): Promise<WishlistDto> {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  public update(
    @Request() req: AuthRequest,
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ): Promise<WishlistDto> {
    return this.wishlistsService.update(id, updateWishlistDto, req.user);
  }

  @Delete(':id')
  public removeOne(
    @Request() req: AuthRequest,
    @Param('id') id: number,
  ): Promise<WishlistDto> {
    return this.wishlistsService.removeOne(id, req.user);
  }
}
