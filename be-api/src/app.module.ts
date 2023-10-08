import { Module, NestModule, MiddlewareConsumer  } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { TransformInterceptor } from 'helpers/transform.interceptor';
import { AllExceptionsFilter } from 'helpers/exception.filter';

import { UploadModule } from 'common/upload/upload.module';
import { AuthModule } from '@app/auth/auth.module';
import { UsersModule } from '@app/users/users.module';
import { GoogleAuthMiddleware } from 'middleware/google-auth.middleware';
import { AuthController } from '@app/auth/auth.controller';
import { FootballFieldsModule } from './apps/football-fields/football-fields.module';

@Module({
  imports: [AuthModule, UploadModule, UsersModule, FootballFieldsModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(GoogleAuthMiddleware)
      .forRoutes(AuthController);
  }
}