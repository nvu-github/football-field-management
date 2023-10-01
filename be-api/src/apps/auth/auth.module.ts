import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaService } from '@src/prisma.service';
import configuration from 'config/configuration';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt-auth.strategy';

@Module({
  controllers: [AuthController, ],
  imports: [JwtModule.register({
    global: true,
    secret: configuration().jwt.secret,
    signOptions: { expiresIn: configuration().jwt.expires },
  })],
  providers: [AuthService, PrismaService, JwtStrategy],
})
export class AuthModule {}
