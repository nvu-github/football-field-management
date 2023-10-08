import { Module } from '@nestjs/common';
import { FootballFieldsController } from './football-fields.controller';

import { PrismaService } from '@src/prisma.service';
import { FootballFieldsService } from './football-fields.service';

@Module({
  controllers: [FootballFieldsController],
  providers: [FootballFieldsService, PrismaService],
})
export class FootballFieldsModule {}
