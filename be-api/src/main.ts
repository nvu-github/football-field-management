import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { static as expressStatic } from 'express';
import { join } from 'path';

import 'module-alias/register';

import { AppModule } from 'src/app.module';
import configuration from 'config/configuration';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const whitelist = configuration().whitelistOrigins;

  app.enableCors({
    origin: function (origin, callback) {
      if (
        !whitelist ||
        whitelist.length == 0 ||
        whitelist.indexOf(origin) !== -1
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false,
  });

  const config = new DocumentBuilder()
    .setTitle('FOOTBALL FIELD API')
    .setDescription('The FOOTBALL FIELD API documents.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  app.use('/public', expressStatic(join(__dirname, '../..', 'public')));
  await app.listen(configuration().port);
  // console.log('App is running on port: ', configuration().port);

  // if (module.hot) {
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }
}
bootstrap();
