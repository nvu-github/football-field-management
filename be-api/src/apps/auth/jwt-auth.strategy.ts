import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

import configuration from 'config/configuration';
import { AuthService } from './auth.service';
import { IUserJWT } from './interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().jwt.secret,
    });
  }

  async validate(payload: IUserJWT) {
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
      staffId: user.staffId,
    };
  }
}
