import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Param,
  HttpStatus,
  HttpException,
  Patch,
  Delete,
} from '@nestjs/common';

import { InvoicesService } from './invoices.service';
import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import { PayloadInvoiceDto, PayloadInvoiceTypeDto } from './dtos';

@ApiTags('Invoice')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('types')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createInvoiceType(@Body() payloads: PayloadInvoiceTypeDto) {
    return this.invoicesService.createInvoiceType(payloads);
  }

  @Patch('types/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateInvoiceType(
    @Param('id') id: string,
    @Body() payloads: PayloadInvoiceTypeDto,
  ) {
    const InvoiceType = await this.invoicesService.getInvoiceType(+id);

    if (!InvoiceType) {
      throw new HttpException(
        'Loại sân bóng này không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.invoicesService.updateInvoiceType(+id, payloads);
  }

  @Delete('types/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteInvoiceType(@Param('id') id: string) {
    const InvoiceType = await this.invoicesService.getInvoiceType(+id);

    if (!InvoiceType) {
      throw new HttpException(
        'Loại sân bóng này không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.invoicesService.deleteInvoiceType(+id);
  }

  @Get('types')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getInvoiceTypes() {
    return this.invoicesService.getInvoiceTypes();
  }

  @Get('types/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getInvoiceType(@Param('id') id: string) {
    const InvoiceType = await this.invoicesService.getInvoiceType(+id);

    if (!InvoiceType) {
      throw new HttpException(
        'Loại sân bóng này không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }
    return InvoiceType;
  }

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
