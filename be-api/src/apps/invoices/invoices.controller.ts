import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Post, UseGuards, Body, Get } from '@nestjs/common';

import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import { PayloadInvoiceDto } from './dtos/payload-invoices.dto';

@ApiTags('Invoice')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createInvoice(@Body() body: PayloadInvoiceDto) {
    return this.invoicesService.createInvoice(body);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getInvoices() {
    return this.invoicesService.getInvoices();
  }
}
