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
    const invoice = await this.prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
      select: {
        id: true,
        totalPrice: true,
        moneyPaid: true,
        status: true,
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
            rentalDate: true,
            customer: {
              select: {
                name: true,
              },
            },
            footballPitchLeasingDuration: {
              select: {
                leasingDuration: {
                  select: {
                    startTime: true,
                    endTime: true,
                  },
                },
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
      totalPrice,
      moneyPaid,
      status,
      invoiceDetail,
      customerFootballPitchRental,
    } = invoice;

    return {
      id,
      totalPrice,
      moneyPaid,
      status,
      rentalDate: customerFootballPitchRental.rentalDate,
      customerName: customerFootballPitchRental.customer.name,
      footballPitchName: customerFootballPitchRental.footballPitch.name,
      customerFootballPitchRentalId: customerFootballPitchRental
        ? customerFootballPitchRental.id
        : null,
      invoiceDetails: invoiceDetail,
    };
  }

  async getInvoices(): Promise<any> {
    const invoices = await this.prisma.invoice.findMany({
      select: {
        id: true,
        totalPrice: true,
        moneyPaid: true,
        status: true,
        customerFootballPitchRental: {
          select: {
            id: true,
            status: true,
            rentalDate: true,
            customer: {
              select: {
                name: true,
              },
            },
            footballPitchLeasingDuration: {
              select: {
                leasingDuration: {
                  select: {
                    startTime: true,
                    endTime: true,
                  },
                },
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
          totalPrice,
          moneyPaid,
          status,
          customerFootballPitchRental,
        } = invoice;
        return {
          id,
          totalPrice,
          moneyPaid,
          status,
          customerName: customerFootballPitchRental.customer.name,
          footballPitchName: customerFootballPitchRental.footballPitch.name,
          customerFootballPitchRentalId: customerFootballPitchRental
            ? customerFootballPitchRental.id
            : null,
          rentalDate: customerFootballPitchRental.rentalDate,
          leasingDurationTime: `${customerFootballPitchRental.footballPitchLeasingDuration.leasingDuration.startTime} - ${customerFootballPitchRental.footballPitchLeasingDuration.leasingDuration.endTime}`,
        };
      });
  }

  async getInvoiceDetail(invoiceId: number): Promise<any> {
    const invoice = await this.prisma.invoice.findUnique({
      where: {
        id: invoiceId,
      },
      select: {
        id: true,
        totalPrice: true,
        status: true,
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
      totalPrice,
      status,
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
      customerName: customerFootballPitchRental.customer.name,
      customerPhoneNumber: customerFootballPitchRental.customer.phoneNumber,
      rentalDate: customerFootballPitchRental
        ? customerFootballPitchRental.rentalDate
        : null,
      footballPitchName: customerFootballPitchRental.footballPitch.name,
      customerFootballPitchRentalId: customerFootballPitchRental
        ? customerFootballPitchRental.id
        : null,
      invoiceDetails: invoiceDetail,
      rentalPrice,
      leasingDurationName,
    };
  }
}
