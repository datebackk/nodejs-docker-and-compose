import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SigninUserResponseDto } from './dto/signin-user-response.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { SignupUserDto } from './dto/signup-user.dto';
import { SignupUserResponseDto } from './dto/signup-user-response.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(LocalAuthGuard)
  public login(
    @Body() signinUserDto: SigninUserDto,
  ): Promise<SigninUserResponseDto> {
    return this.authService.signin(signinUserDto);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  public signup(
    @Body() createUserDto: SignupUserDto,
  ): Promise<SignupUserResponseDto> {
    return this.authService.signup(createUserDto);
  }
}
