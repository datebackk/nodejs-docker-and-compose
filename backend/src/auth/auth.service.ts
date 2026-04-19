import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupUserDto } from './dto/signup-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { SigninUserResponseDto } from './dto/signin-user-response.dto';
import { SignupUserResponseDto } from './dto/signup-user-response.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { comparePasswords, hashPassword, toDto } from '../utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async signin(
    signinUserDto: SigninUserDto,
  ): Promise<SigninUserResponseDto> {
    const user = await this.usersService.findByUsernameOrEmail(
      signinUserDto.username,
    );

    const payload = {
      sub: user.id,
      username: user.username,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  public async signup(
    createUserDto: SignupUserDto,
  ): Promise<SignupUserResponseDto> {
    const user = await this.usersService.findByUsernameOrEmail(
      createUserDto.username,
      createUserDto.email,
    );

    if (user) {
      throw new ConflictException(
        'Пользователь с таким email или username уже зарегистрирован',
      );
    }

    const hashedPassword = await hashPassword(createUserDto.password);

    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    } as User);

    return toDto(SignupUserResponseDto, newUser);
  }

  public async validateUser(
    username: string,
    pass: string,
  ): Promise<User | null> {
    const user = await this.usersService.findByUsernameOrEmail(username);
    const isPasswordValid = await comparePasswords(pass, user.password);

    if (user && isPasswordValid) {
      return user;
    }

    return null;
  }
}
