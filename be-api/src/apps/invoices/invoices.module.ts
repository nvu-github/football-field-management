import { Module } from '@nestjs/common';

import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { FootballPitchesService } from '@app/football-pitches/football-pitches.service';
import { PrismaService } from '@src/prisma.service';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService, PrismaService, FootballPitchesService],
})
export class InvoicesModule {}
