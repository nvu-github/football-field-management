import { Module } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';

import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, PrismaService],
})
export class ReportsModule {}
