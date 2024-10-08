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
            id: true,
            name: true,
          },
        },
        invoiceDetail: {
          select: {
            amount: true,
            finalCost: true,
            createdAt: true,
            invoice: {
              select: {
                status: true,
              },
            },
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

          if (month)
            condition =
              condition && Number(month) === Number(monthInvoiceCreated);
          if (year)
            condition =
              condition && Number(year) === Number(yearInvoiceCreated);

          accumulator.amount +=
            condition && invoiceDetail.invoice.status === 'PAID'
              ? Number(invoiceDetail.amount)
              : 0;
          accumulator.price +=
            condition && invoiceDetail.invoice.status === 'PAID'
              ? Number(invoiceDetail.finalCost)
              : 0;
          accumulator.rented +=
            condition &&
            invoiceDetail.invoice.status === 'PAID' &&
            accessoryType.id === 1
              ? 1
              : 0;
          return accumulator;
        },
        {
          amount: 0,
          price: 0,
          rented: 0,
        },
      );

      return {
        id,
        name,
        accessoryType,
        totalAmount: total.amount,
        totalPrice: total.price,
        totalRented: total.rented,
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
        good: Number(
          (
            (total.scoreGood / (total.scoreGood + total.scoreBad)) *
            100
          ).toFixed(1),
        ),
        bad: Number(
          ((total.scoreBad / (total.scoreGood + total.scoreBad)) * 100).toFixed(
            1,
          ),
        ),
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
            rentalDate: true,
            footballPitchId: true,
            footballPitchLeasingDuration: {
              select: {
                price: true,
              },
            },
            accessoryRentalCustomer: {
              select: {
                amount: true,
                accessory: {
                  select: {
                    price: true,
                  },
                },
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
          const monthRentalCreated = format(new Date(rental.rentalDate), 'MM');
          const yearRentalCreated = format(new Date(rental.rentalDate), 'yyyy');

          if (month)
            condition =
              condition && Number(month) === Number(monthRentalCreated);
          if (year)
            condition = condition && Number(year) === Number(yearRentalCreated);

          const IsAccept = rental.status === 'ACCEPT';
          const isCanceled = rental.status === 'REJECT';

          const totalAccessory = rental.accessoryRentalCustomer.reduce(
            (total, accessoryRental) => {
              return (total +=
                Number(accessoryRental.amount) *
                accessoryRental.accessory.price);
            },
            0,
          );

          accumulator.rented += condition && IsAccept ? 1 : 0;
          accumulator.canceled += condition && isCanceled ? 1 : 0;
          accumulator.revenueFootball +=
            condition && IsAccept
              ? Number(rental.footballPitchLeasingDuration.price)
              : 0;
          accumulator.revenueAccessory +=
            condition && IsAccept ? Number(totalAccessory) : 0;
          accumulator.revenue +=
            condition && IsAccept
              ? Number(rental.footballPitchLeasingDuration.price) +
                Number(totalAccessory)
              : 0;

          return accumulator;
        },
        {
          rented: 0,
          canceled: 0,
          revenueFootball: 0,
          revenueAccessory: 0,
          revenue: 0,
        },
      );

      return {
        id,
        name,
        footballType,
        totalRented: total.rented,
        totalCanceled: total.canceled,
        totalRevenueFootball: total.revenueFootball,
        totalRevenueAccessory: total.revenueAccessory,
        totalRevenue: total.revenue,
      };
    });
  }

  async getReportRevenues(query?: any): Promise<any> {
    const { month, year }: any = query || {};
    const monthReport = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const defaultYear = new Date().getFullYear();

    const reports = await Promise.all(
      monthReport.map(async (month) => {
        const footballPitches = await this.getReportRentalFields({
          month,
          year: year || defaultYear,
        });
        const accessories = await this.getReportAccessories({
          month,
          year: year || defaultYear,
        });

        const totalRevenueFootballPitch = footballPitches.reduce(
          (total, fp) => total + fp.totalRevenueFootball,
          0,
        );
        const totalRevenueAccessory = accessories.reduce(
          (total, accessory) => {
            const rentalType = 1;
            const isAccessoryRental = accessory.accessoryType.id === rentalType;
            total.rental += isAccessoryRental ? accessory.totalPrice : 0;
            total.sell += !isAccessoryRental ? accessory.totalPrice : 0;

            return total;
          },
          {
            rental: 0,
            sell: 0,
          },
        );

        const totalRevenue =
          totalRevenueFootballPitch +
          totalRevenueAccessory.rental +
          totalRevenueAccessory.sell;

        return {
          month,
          totalRevenueFootballPitch,
          totalRevenueAccessory,
          totalRevenue,
        };
      }),
    );

    return reports.filter(
      (report: any) => !month || Number(month) === Number(report.month),
    );
  }
}
