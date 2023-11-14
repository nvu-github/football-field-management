import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) { }

  async getReportAccessories(query?: object): Promise<any> {
    const accessories = await this.prisma.accessory.findMany({
      select: {
        id: true,
        name: true,
        accessoryType: {
          select: {
            name: true,
          },
        },
        invoiceDetail: {
          select: {
            amount: true,
            finalCost: true,
          },
        },
      },
    });

    return accessories.map((accessory) => {
      const { id, name, accessoryType, invoiceDetail } = accessory;

      const total = invoiceDetail.reduce(
        (total, invoiceDetail) => {
          return {
            amount: (total.amount += Number(invoiceDetail.amount)),
            price: total.price + Number(invoiceDetail.finalCost),
          };
        },
        {
          amount: 0,
          price: 0,
        },
      );

      return {
        id,
        name,
        accessoryType,
        totalAmount: total.amount,
        totalPrice: total.price,
      };
    });
  }

  async getReportEvaluations(): Promise<any> {
    const footballPitches = await this.prisma.footballPitch.findMany({
      select: {
        id: true,
        name: true,
        footballType: {
          select: {
            name: true,
          },
        },
        evaluation: {
          select: {
            score: true,
          },
        },
      },
    });

    return footballPitches.map((footballPitch) => {
      const { id, name, footballType, evaluation } = footballPitch;

      const total = evaluation.reduce(
        (accumulator, evaluation) => {
          const isEvaluationGood = Number(evaluation.score) >= 3;
          const isEvaluationBad = Number(evaluation.score) < 3;

          accumulator.countGood += isEvaluationGood ? 1 : 0;
          accumulator.countBad += isEvaluationBad ? 1 : 0;
          accumulator.scoreGood += isEvaluationGood
            ? Number(evaluation.score)
            : 0;
          accumulator.scoreBad += isEvaluationBad
            ? Number(evaluation.score)
            : 0;

          return accumulator;
        },
        {
          countGood: 0,
          countBad: 0,
          scoreGood: 0,
          scoreBad: 0,
        },
      );

      const totalScorePercent = {
        good:
          total.scoreGood && total.scoreBad
            ? Number(
              (
                (total.scoreGood / (total.scoreGood + total.scoreBad)) *
                100
              ).toFixed(1),
            )
            : 0,
        bad:
          total.scoreGood && total.scoreBad
            ? Number(
              (
                (total.scoreBad / (total.scoreGood + total.scoreBad)) *
                100
              ).toFixed(1),
            )
            : 0,
      };

      return {
        id,
        name,
        footballType,
        totalCount: {
          good: total.countGood,
          bad: total.countBad,
        },
        totalScore: {
          good: total.scoreGood,
          bad: total.scoreBad,
        },
        totalScorePercent,
      };
    });
  }

  async getReportRentalFields(): Promise<any> {
    const footballPitches = await this.prisma.footballPitch.findMany({
      select: {
        id: true,
        name: true,
        footballType: {
          select: {
            name: true,
          },
        },
        customerFootballPitchRental: {
          select: {
            id: true,
            status: true,
            footballPitchLeasingDuration: {
              select: {
                price: true,
              },
            },
          },
        },
      },
    });

    return footballPitches.map((footballPitch) => {
      const { id, name, footballType, customerFootballPitchRental }: any =
        footballPitch;

      const total = customerFootballPitchRental.reduce(
        (accumulator, rental) => {
          const isRented = rental.status === 'ACCEPT';
          const isCanceled = rental.status === 'REJECT';

          accumulator.rented += isRented ? 1 : 0;
          accumulator.canceled += isCanceled ? 1 : 0;
          accumulator.revenue += isRented
            ? Number(rental.footballPitchLeasingDuration.price)
            : 0;

          return accumulator;
        },
        {
          rented: 0,
          canceled: 0,
          revenue: 0,
        },
      );

      return {
        id,
        name,
        footballType,
        totalRented: total.rented,
        totalCanceled: total.canceled,
        totalRevenue: total.revenue,
      };
    });
  }

  async getReportRevenues(): Promise<any> {
    const footballPitches = await this.getReportRentalFields();
    const accessories = await this.getReportAccessories();
  }
}
