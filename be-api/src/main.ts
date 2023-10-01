import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import 'module-alias/register';

import { AppModule } from 'src/app.module';
import configuration from 'config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    .setTitle('FOOTBALL_FIELD_MANAGEMENT API')
    .setDescription('The FOOTBALL_FIELD_MANAGEMENT API documents.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configuration().port);
}
bootstrap();
