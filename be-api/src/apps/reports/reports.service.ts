import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { format } from 'date-fns';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getReportAccessories(query?: any): Promise<any> {
    const { month, year }: any = query || {};
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
            createdAt: true,
          },
        },
      },
    });

    return accessories.map((accessory) => {
      const { id, name, accessoryType, invoiceDetail } = accessory;

      const total = invoiceDetail.reduce(
        (accumulator, invoiceDetail) => {
          let condition = true;
          const monthInvoiceCreated = format(
            new Date(invoiceDetail.createdAt),
            'MM',
          );
          const yearInvoiceCreated = format(
            new Date(invoiceDetail.createdAt),
            'yyyy',
          );

          if (month) condition = condition && month === monthInvoiceCreated;
          if (year) condition = condition && year === yearInvoiceCreated;

          accumulator.amount += condition ? Number(invoiceDetail.amount) : 0;
          accumulator.price += condition ? Number(invoiceDetail.finalCost) : 0;

          return accumulator;
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

  async getReportEvaluations(query?: any): Promise<any> {
    const { month, year }: any = query || {};
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
            createdAt: true,
          },
        },
      },
    });

    return footballPitches.map((footballPitch) => {
      const { id, name, footballType, evaluation } = footballPitch;

      const total = evaluation.reduce(
        (accumulator, evaluation) => {
          let condition = true;
          const monthEvaluationCreated = format(
            new Date(evaluation.createdAt),
            'MM',
          );
          const yearEvaluationCreated = format(
            new Date(evaluation.createdAt),
            'yyyy',
          );
          const isEvaluationGood = Number(evaluation.score) >= 3;
          const isEvaluationBad = Number(evaluation.score) < 3;

          if (month) condition = condition && month === monthEvaluationCreated;
          if (year) condition = condition && year === yearEvaluationCreated;

          accumulator.countGood += condition && isEvaluationGood ? 1 : 0;
          accumulator.countBad += condition && isEvaluationBad ? 1 : 0;
          accumulator.scoreGood +=
            condition && isEvaluationGood ? Number(evaluation.score) : 0;
          accumulator.scoreBad +=
            condition && isEvaluationBad ? Number(evaluation.score) : 0;

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

  async getReportRentalFields(query?: any): Promise<any> {
    const { month, year }: any = query || {};
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
            createdAt: true,
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
          let condition = true;
          const monthRentalCreated = format(new Date(rental.createdAt), 'MM');
          const yearRentalCreated = format(new Date(rental.createdAt), 'yyyy');

          if (month) condition = condition && month === monthRentalCreated;
          if (year) condition = condition && year === yearRentalCreated;

          const isRented = rental.status === 'ACCEPT';
          const isCanceled = rental.status === 'REJECT';

          accumulator.rented += condition && isRented ? 1 : 0;
          accumulator.canceled += condition && isCanceled ? 1 : 0;
          accumulator.revenue +=
            condition && isRented
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

  async getReportRevenues(query?: any): Promise<any> {
    const { month, year }: any = query || {};
    const footballPitches = await this.getReportRentalFields();
    console.log(footballPitches);
    const accessories = await this.getReportAccessories();

    return null;
  }
}
