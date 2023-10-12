import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Request,
  UseGuards,
  Response,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import configuration from 'config/configuration';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './google-auth.guard';

import { SigninDto, SignUpDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async signInGoogle(@Request() req) {}

  @Get('/google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleCallback(@Request() req) {
    return this.authService.googleLogin(req);
  }

  @Post('signin')
  async signIn(
    @Body() params: SigninDto,
    @Response({ passthrough: true }) res: any,
  ) {
    const { email, password } = params;
    const account = await this.authService.getUser(email);
    if (!account) {
      throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    }

    if (!bcrypt.compareSync(password, account.password)) {
      throw new HttpException('Wrong password!', HttpStatus.BAD_REQUEST);
    }

    delete account.password;
    const jwtPayloads = {
      id: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
    };
    const accessToken = await this.jwtService.signAsync(jwtPayloads, {
      secret: configuration().jwt.secret,
    });

    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 15,
      httpOnly: true,
      sameSite: 'strict',
    });

    return account;
  }

  @Post('signup')
  async signup(
    @Body() params: SignUpDto,
    @Response({ passthrough: true }) res: any,
  ) {
    const { email, password } = params;
    const account = await this.authService.getAccountByEmail(email);

    if (account) {
      throw new HttpException('Email đã tồn tại!', HttpStatus.NOT_FOUND);
    }

    const user = await this.authService.signUp({
      ...params,
      password: bcrypt.hashSync(password, +configuration().salt),
    });

    const jwtPayloads = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayloads, {
      secret: configuration().jwt.secret,
    });

    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 15,
      httpOnly: true,
    });

    return user;
  }
}
