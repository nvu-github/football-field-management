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

  creatInvoiceFootballPitchRental(payload: any): Promise<any> {
    return this.prisma.invoiceFootballPitchRental.create({
      data: payload,
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
        invoiceFootballPitchRental: {
          select: {
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
        },
      },
    });
    const {
      id,
      totalPrice,
      moneyPaid,
      status,
      invoiceDetail,
      invoiceFootballPitchRental,
    } = invoice;

    return {
      id,
      totalPrice,
      moneyPaid,
      status,
      invoiceFootballPitchRental,
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
        invoiceFootballPitchRental: {
          select: {
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
          invoiceFootballPitchRental,
        } = invoice;
        return {
          id,
          totalPrice,
          moneyPaid,
          status,
          invoiceFootballPitchRental,
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
        invoiceFootballPitchRental: {
          select: {
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
        },
      },
    });
    const {
      id,
      totalPrice,
      status,
      invoiceDetail,
      invoiceFootballPitchRental,
    } = invoice;

    return {
      id,
      totalPrice,
      status,
      invoiceFootballPitchRental,
      invoiceDetails: invoiceDetail,
    };
  }
}
