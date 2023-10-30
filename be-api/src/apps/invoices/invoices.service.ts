import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';

import { PayloadInvoiceDto } from './dtos/payload-invoices.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService){}

  createInvoice(payload: any) {
    return this.prisma.invoice.create({
      data: {
        ...payload
      }
    })
  }
}
