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
import { AuthGuard } from '@nestjs/passport';

import configuration from 'config/configuration';
import { AuthService } from './auth.service';

import { SigninDto, SignUpDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('gogle')
  @UseGuards(AuthGuard('google'))
  async signinGoogle(@Request() req) {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Request() req) {
    return req;
  }

  @Post('signin')
  async signin(@Body() params: SigninDto, @Response() res) {
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
    });

    return {
      ...account,
    };
  }

  @Post('signup')
  async signup(@Body() params: SignUpDto) {
    const { email, password } = params;
    const account = await this.authService.getUser(email);

    if (account) {
      throw new HttpException('Email đã tồn tại!', HttpStatus.NOT_FOUND);
    }

    const user = await this.authService.signUp({
      ...params,
      password: bcrypt.hashSync(password, configuration().salt),
    });

    const jwtPayloads = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return {
      ...user,
      accessToken: await this.jwtService.signAsync(jwtPayloads, {
        secret: configuration().jwt.secret,
      }),
    };
  }
}
