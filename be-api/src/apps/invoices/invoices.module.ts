import { Module } from '@nestjs/common';

import { InvoicesController } from './invoices.controller';

import { InvoicesService } from './invoices.service';
import { FootballPitchesService } from '@app/football-pitches/football-pitches.service';
import { AccessoriesService } from '@app/accessories/accessories.service';

import { PrismaService } from '@src/prisma.service';

@Module({
  controllers: [InvoicesController],
  providers: [
    InvoicesService,
    PrismaService,
    FootballPitchesService,
    AccessoriesService,
  ],
})
export class InvoicesModule {}
