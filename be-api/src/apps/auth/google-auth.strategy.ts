import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '669677140208-pu05hihj0brki144e8b774j9tvput9ni.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL:
        'https://65aa-2a04-3543-1000-2310-9c5c-9fff-fe07-33c2.ngrok-free.app/auth/google/redirect',
      // callbackURL: 'http://94.237.79.224:8081/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
