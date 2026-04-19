import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Wish } from '../wishes/entities/wish.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserPublicProfileResponseDto } from './dto/user-public-profile-response.dto';
import { UserWishesDto } from '../wishes/dto/user-wishes.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UserRequest } from '../auth/types/auth-request';
import { WishDto } from '../wishes/dto/wish.dto';
import { hashPassword, toArrayDto, toDto } from '../utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  public async findMe(
    currentUser: UserRequest,
  ): Promise<UserProfileResponseDto> {
    const found = await this.userRepository.findOne({
      where: { id: currentUser.id },
    });

    if (!found) {
      throw new NotFoundException();
    }

    return toDto(UserProfileResponseDto, found);
  }

  public async findOne(
    username: string,
  ): Promise<UserPublicProfileResponseDto> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException();
    }

    return toDto(UserPublicProfileResponseDto, user);
  }

  public async getWishes(username: string): Promise<UserWishesDto[]> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException();
    }

    const wishes = await this.wishRepository.find({
      where: { owner: { id: user.id } },
      relations: ['offers'],
    });

    return toArrayDto(UserWishesDto, wishes);
  }

  public async update(
    updateUserDto: UpdateUserDto,
    currentUser: UserRequest,
  ): Promise<UserProfileResponseDto> {
    if (!!updateUserDto.username || !!updateUserDto.email) {
      const users = await this.userRepository.find({
        where: [
          { email: updateUserDto.email },
          { username: updateUserDto.username },
        ],
      });

      if (!!users.length && users.some((value) => value.id != currentUser.id)) {
        throw new ConflictException(
          'Имя пользователя или email уже используются',
        );
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }

    await this.userRepository.update({ id: currentUser.id }, updateUserDto);

    return this.findMe(currentUser);
  }

  public async getMyWishes(currentUser: UserRequest): Promise<WishDto[]> {
    const wishes = await this.wishRepository.find({
      where: { owner: { id: currentUser.id } },
      relations: ['owner', 'offers'],
    });

    return toArrayDto(WishDto, wishes);
  }

  public async findUsers(
    findUsersDto: FindUsersDto,
  ): Promise<UserPublicProfileResponseDto[]> {
    if (!findUsersDto.query?.length) {
      return [];
    }

    const users = await this.userRepository.find({
      where: [
        { email: Like(`%${findUsersDto.query}%`) },
        { username: Like(`%${findUsersDto.query}%`) },
      ],
    });

    return toArrayDto(UserPublicProfileResponseDto, users);
  }

  public async findByUsernameOrEmail(username: string, email?: string) {
    return this.userRepository.findOne({
      where: [{ username: username }, { email: email }],
    });
  }

  public async create(user: User) {
    return await this.userRepository.save(user);
  }
}
