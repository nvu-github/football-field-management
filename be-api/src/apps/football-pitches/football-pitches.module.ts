import { Module } from '@nestjs/common';
import { FootballPitchesController } from './football-pitches.controller';

import { PrismaService } from '@src/prisma.service';
import { FootballPitchesService } from './football-pitches.service';

@Module({
  controllers: [FootballPitchesController],
  providers: [FootballPitchesService, PrismaService],
})
export class FootballPitchesModule {}
