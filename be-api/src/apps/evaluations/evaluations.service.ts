import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { PayloadEvaluationDto } from './dtos';

@Injectable()
export class EvaluationsService {
  constructor(private readonly prisma: PrismaService) {}

  createEvaluation(payload: any): Promise<any> {
    return this.prisma.evaluation.create({
      data: payload,
    });
  }

  updateEvaluation(evaluationId: number, payload: any): Promise<any> {
    return this.prisma.evaluation.update({
      where: {
        id: evaluationId,
      },
      data: payload,
    });
  }

  deleteEvaluation(evaluationId: number): Promise<any> {
    return this.prisma.evaluation.delete({
      where: {
        id: evaluationId,
      },
    });
  }

  getEvaluation(evaluationId: number): Promise<any> {
    return this.prisma.evaluation.findUnique({
      where: {
        id: evaluationId,
      },
      select: {
        id: true,
        score: true,
        content: true,
        image: true,
        customer: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  getEvaluations(): Promise<any> {
    return this.prisma.evaluation.findMany({
      select: {
        id: true,
        score: true,
        content: true,
        image: true,
        customer: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
