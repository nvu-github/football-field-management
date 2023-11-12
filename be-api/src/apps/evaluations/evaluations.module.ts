import { Module } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';

@Module({
  controllers: [EvaluationsController],
  providers: [EvaluationsService, PrismaService],
})
export class EvaluationsModule {}
