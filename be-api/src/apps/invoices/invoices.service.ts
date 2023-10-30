import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';

import { PayloadInvoiceDto } from './dtos/payload-invoices.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  createInvoice(payload: any): Promise<any> {
    return this.prisma.invoice.create({
      data: {
        ...payload,
      },
    });
  }

  async getInvoices(): Promise<any> {
    const invoices = await this.prisma.invoice.findMany({
      select: {
        id: true,
        totalPrice: true,
        moneyPaid: true,
        status: true,
        invoiceType: {
          select: {
            id: true,
            name: true,
          },
        },
        customerFootballPitchRental: {
          select: {
            customer: {
              select: {
                name: true,
              },
            },
            footballPitch: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return invoices.map((invoice) => {
      const {
        id,
        totalPrice,
        moneyPaid,
        status,
        invoiceType,
        customerFootballPitchRental,
      } = invoice;
      const { customer, footballPitch } = customerFootballPitchRental;
      return {
        id,
        totalPrice,
        moneyPaid,
        status,
        invoiceType: invoiceType.name,
        customerName: customer.name,
        footballPitchName: footballPitch.name,
      };
    });
  }
}
