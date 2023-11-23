import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';
import { FootballPitchesService } from '@app/football-pitches/football-pitches.service';

import { PayloadInvoiceDto } from './dtos/payload-invoices.dto';
import { PayloadInvoiceTypeDto } from './dtos';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly footballPitchService: FootballPitchesService,
  ) {}

  createInvoice(payload: any): Promise<any> {
    return this.prisma.invoice.create({
      data: {
        ...payload,
      },
    });
  }

  createInvoiceDetails(payload: any): Promise<any> {
    return this.prisma.invoiceDetail.createMany({
      data: payload,
    });
  }

  updateInvoice(invoiceId: number, payload: any): Promise<any> {
    return this.prisma.invoice.update({
      where: {
        id: invoiceId,
      },
      data: {
        ...payload,
      },
    });
  }

  deleteInvoice(invoiceId: number): Promise<any> {
    return this.prisma.invoice.delete({
      where: {
        id: invoiceId,
      },
    });
  }

  deleteInvoiceDetails(invoiceId: number): Promise<any> {
    return this.prisma.invoiceDetail.deleteMany({
      where: {
        invoiceId,
      },
    });
  }

  deleteInvoiceDetail(id: number): Promise<any> {
    return this.prisma.invoiceDetail.delete({
      where: {
        id,
      },
    });
  }

  async getInvoice(invoiceId: number): Promise<any> {
    const RENTAL_INVOICE = 1;
    const invoice = await this.prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
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
        invoiceDetail: {
          select: {
            id: true,
            accessoryId: true,
            amount: true,
            price: true,
            finalCost: true,
            invoiceId: true,
            accessory: {
              select: {
                name: true,
              },
            },
          },
        },
        customerFootballPitchRental: {
          select: {
            id: true,
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
    const {
      id,
      customerName,
      totalPrice,
      moneyPaid,
      status,
      invoiceType,
      invoiceDetail,
      customerFootballPitchRental,
    } = invoice;

    return {
      id,
      totalPrice,
      moneyPaid,
      status,
      invoiceTypeId: invoiceType.id,
      invoiceTypeName: invoiceType.name,
      customerName:
        invoiceType.id === RENTAL_INVOICE
          ? customerFootballPitchRental.customer.name
          : customerName,
      footballPitchName:
        invoiceType.id === RENTAL_INVOICE
          ? customerFootballPitchRental.footballPitch.name
          : '',
      customerFootballPitchRentalId: customerFootballPitchRental
        ? customerFootballPitchRental.id
        : null,
      invoiceDetails: invoiceDetail,
    };
  }

  async getInvoices(): Promise<any> {
    const RENTAL_INVOICE = 1;
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
            id: true,
            status: true,
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

    return invoices
      .filter((invoice: any) =>
        invoice.customerFootballPitchRental
          ? invoice.customerFootballPitchRental.status === 'ACCEPT'
          : true,
      )
      .map((invoice) => {
        const {
          id,
          customerName,
          totalPrice,
          moneyPaid,
          status,
          invoiceType,
          customerFootballPitchRental,
        } = invoice;
        return {
          id,
          totalPrice,
          moneyPaid,
          status,
          invoiceTypeId: invoiceType.id,
          invoiceTypeName: invoiceType.name,
          customerName:
            invoiceType.id === RENTAL_INVOICE
              ? customerFootballPitchRental.customer.name
              : customerName,
          footballPitchName:
            invoiceType.id === RENTAL_INVOICE
              ? customerFootballPitchRental.footballPitch.name
              : '',
          customerFootballPitchRentalId: customerFootballPitchRental
            ? customerFootballPitchRental.id
            : null,
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

  async getInvoiceDetail(invoiceId: number): Promise<any> {
    const RENTAL_INVOICE = 1;
    const invoice = await this.prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
      select: {
        id: true,
        customerName: true,
        totalPrice: true,
        status: true,
        invoiceType: {
          select: {
            id: true,
          },
        },
        invoiceDetail: {
          select: {
            id: true,
            accessoryId: true,
            amount: true,
            price: true,
            finalCost: true,
            accessory: {
              select: {
                name: true,
              },
            },
          },
        },
        customerFootballPitchRental: {
          select: {
            id: true,
            footballPitchLeasingDurationId: true,
            rentalDate: true,
            customer: {
              select: {
                name: true,
                phoneNumber: true,
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
    const {
      id,
      customerName,
      totalPrice,
      status,
      invoiceType,
      invoiceDetail,
      customerFootballPitchRental,
    } = invoice;

    const footballPitchLeasingDuration = customerFootballPitchRental
      ? await this.footballPitchService.getFootballPitchPrice(
          customerFootballPitchRental.footballPitchLeasingDurationId,
        )
      : { price: null, leasingDurationName: null };

    const { price: rentalPrice, leasingDurationName } =
      footballPitchLeasingDuration;

    return {
      id,
      totalPrice,
      status,
      invoiceTypeId: invoiceType.id,
      customerName:
        invoiceType.id === RENTAL_INVOICE
          ? customerFootballPitchRental.customer.name
          : customerName,
      customerPhoneNumber: customerFootballPitchRental
        ? customerFootballPitchRental.customer.phoneNumber
        : null,
      rentalDate: customerFootballPitchRental
        ? customerFootballPitchRental.rentalDate
        : null,
      footballPitchName:
        invoiceType.id === RENTAL_INVOICE
          ? customerFootballPitchRental.footballPitch.name
          : '',
      customerFootballPitchRentalId: customerFootballPitchRental
        ? customerFootballPitchRental.id
        : null,
      invoiceDetails: invoiceDetail,
      rentalPrice,
      leasingDurationName,
    };
  }
}
