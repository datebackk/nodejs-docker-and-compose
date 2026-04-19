import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { UserWishesDto } from '../wishes/dto/user-wishes.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthRequest } from '../auth/types/auth-request';
import { WishDto } from '../wishes/dto/wish.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  public findMe(@Request() req: AuthRequest): Promise<UserProfileResponseDto> {
    return this.usersService.findMe(req.user);
  }

  @Get('me/wishes')
  public getMyWishes(@Request() req: AuthRequest): Promise<WishDto[]> {
    return this.usersService.getMyWishes(req.user);
  }

  @Get(':username')
  public findOne(
    @Param('username') username: string,
  ): Promise<UserPublicProfileResponseDto> {
    return this.usersService.findOne(username);
  }

  @Get(':username/wishes')
  public getWishes(
    @Param('username') username: string,
  ): Promise<UserWishesDto[]> {
    return this.usersService.getWishes(username);
  }

  @Post('find')
  @HttpCode(HttpStatus.CREATED)
  public findUsers(
    @Body() findUsersDto: FindUsersDto,
  ): Promise<UserPublicProfileResponseDto[]> {
    return this.usersService.findUsers(findUsersDto);
  }

  @Patch('me')
  public update(
    @Request() req: AuthRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.update(updateUserDto, req.user);
  }
}
