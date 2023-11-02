import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';

import { PayloadInvoiceDto } from './dtos/payload-invoices.dto';
import { PayloadInvoiceTypeDto } from './dtos';

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
        customerName: true,
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
        customerName,
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
        invoiceTypeId: invoiceType.id,
        invoiceTypeName: invoiceType.name,
        customerName: invoiceType.id === 1 ? customer.name : customerName,
        footballPitchName: footballPitch.name,
      };
    });
  }

  createInvoiceType(params: PayloadInvoiceTypeDto) {
    return this.prisma.invoiceType.create({
      data: params,
    });
  }

  updateInvoiceType(id: number, payloads: PayloadInvoiceTypeDto): Promise<any> {
    return this.prisma.invoiceType.update({
      where: {
        id,
      },
      data: {
        ...payloads,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  deleteInvoiceType(id: number): Promise<any> {
    return this.prisma.invoiceType.delete({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  getInvoiceTypes(): Promise<any[]> {
    return this.prisma.invoiceType.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  getInvoiceType(id: number): Promise<any> {
    return this.prisma.invoiceType.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
}
