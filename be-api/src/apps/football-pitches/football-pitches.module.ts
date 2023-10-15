import { Module } from '@nestjs/common';
import { FootballPitchesController } from './football-pitches.controller';

import { PrismaService } from '@src/prisma.service';
import { FootballPitchesService } from './football-pitches.service';
import { UploadService } from 'common/upload/upload.service';

@Module({
  controllers: [FootballPitchesController],
  providers: [FootballPitchesService, PrismaService, UploadService],
})
export class FootballPitchesModule {}
