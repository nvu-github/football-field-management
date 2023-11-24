import { Module } from '@nestjs/common';
import { FootballPitchesController } from './football-pitches.controller';

import { PrismaService } from '@src/prisma.service';
import { FootballPitchesService } from './football-pitches.service';
import { UploadService } from 'common/upload/upload.service';
import { AccessoriesService } from '@app/accessories/accessories.service';
import { InvoicesService } from '@app/invoices/invoices.service';

@Module({
  controllers: [FootballPitchesController],
  providers: [
    FootballPitchesService,
    PrismaService,
    UploadService,
    AccessoriesService,
    InvoicesService,
  ],
})
export class FootballPitchesModule {}
