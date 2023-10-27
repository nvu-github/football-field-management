import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import configuration from 'config/configuration';
import { AuthService } from './auth.service';
import { IUserJWT } from './interfaces';

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'wsjwt') {
  constructor(
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      ignoreExpiration: false,
      secretOrKey: configuration().jwt.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: IUserJWT) {
    const user = await this.authService.getUserById(payload.id);
    if (!user || !user.id) {
      throw new HttpException('Account is not exists!', HttpStatus.NOT_FOUND);
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      customerId: user.customerId,
    };
  }
}
