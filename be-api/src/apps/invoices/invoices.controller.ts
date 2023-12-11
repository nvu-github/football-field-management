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
  Request,
  Query,
} from '@nestjs/common';

import { InvoicesService } from './invoices.service';
import { AccessoriesService } from '@app/accessories/accessories.service';
import { FootballPitchesService } from '@app/football-pitches/football-pitches.service';

import { mergeAccessoryRental } from 'utils/app';

import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import { PayloadInvoiceDto, PayloadInvoiceTypeDto } from './dtos';

@ApiTags('Invoice')
@Controller('invoices')
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly accessoryService: AccessoriesService,
    private readonly footballPitchesService: FootballPitchesService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createInvoice(@Body() body: PayloadInvoiceDto, @Request() req: any) {
    const { staffId } = req.user;
    const { invoiceDetails, staffId: staffBody, customerFootballIds } = body;

    if (!staffBody) body.staffId = staffId;

    if (!body.moneyPaid) body.moneyPaid = body.totalPrice;
    delete body.invoiceDetails;
    delete body.customerFootballIds;
    const invoiceCreated = await this.invoicesService.createInvoice(body);

    if (!invoiceCreated)
      throw new HttpException('Tạo hóa đơn thất bại', HttpStatus.BAD_REQUEST);

    if (customerFootballIds) {
      const formattedPayloadInvoiceFootballPitchRental =
        customerFootballIds.map((id: any) => ({
          customerFootballPitchId: id,
          invoiceId: invoiceCreated.id,
        }));
      await this.invoicesService.creatInvoiceFootballPitchRental(
        formattedPayloadInvoiceFootballPitchRental,
      );
    }

    if (invoiceDetails && invoiceDetails.length > 0) {
      const formattedPayloadInvoiceDetails = invoiceDetails.map(
        ({ amount, price, finalCost, accessoryId }) => ({
          amount: Number(amount),
          price,
          finalCost,
          accessoryId,
          invoiceId: invoiceCreated.id,
        }),
      );
      await this.invoicesService.createInvoiceDetails(
        formattedPayloadInvoiceDetails,
      );
    }

    return invoiceCreated;
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateInvoice(
    @Param('id') id: string,
    @Body() body: PayloadInvoiceDto,
    @Request() req: any,
  ) {
    const { staffId } = req.user;
    const { invoiceDetails, staffId: staffBody, customerFootballIds } = body;
    const invoice = await this.invoicesService.getInvoice(+id);

    if (!invoice)
      throw new HttpException('Không tìm thấy hóa đơn', HttpStatus.BAD_REQUEST);

    if (!staffBody) body.staffId = staffId;

    if (customerFootballIds) {
      await this.invoicesService.deleteInvoiceFootballPitchRental(+id);
      const formattedPayloadInvoiceFootballPitchRental =
        customerFootballIds.map((customerFootballId: any) => ({
          customerFootballPitchId: customerFootballId,
          invoiceId: +id,
        }));
      await this.invoicesService.creatInvoiceFootballPitchRental(
        formattedPayloadInvoiceFootballPitchRental,
      );
    }

    if (body.status === 'PAID' && body.invoiceDetails) {
      await this.invoicesService.deleteInvoiceDetails(+id);
      const formattedPayloadInvoiceDetails = invoiceDetails.map(
        ({ amount, price, finalCost, accessoryId }) => ({
          amount: Number(amount),
          price,
          finalCost,
          accessoryId,
          invoiceId: +id,
        }),
      );
      await this.invoicesService.createInvoiceDetails(
        formattedPayloadInvoiceDetails,
      );
    }

    if (body.status === 'PAID') {
      const customerFootballPitchIds =
        await this.invoicesService.getCustomerFootballIdByInvoiceId(+id);
      const accessoryRentals =
        await this.footballPitchesService.getAccessoryRentalCustomerByCustomerFootballPitchId(
          customerFootballPitchIds,
        );

      const dataAmountAccessories = await Promise.all(
        accessoryRentals.map(async (accessory: any) => {
          const amountAccessory = await this.accessoryService.getAccessory(
            accessory.accessoryId,
          );
          return {
            id: accessory.accessoryId,
            amount:
              accessory.accessoryTypeId == 1
                ? amountAccessory.amount + accessory.amount
                : amountAccessory.amount,
          };
        }),
      );

      await Promise.all(
        dataAmountAccessories.map(
          async (accessory) =>
            await this.accessoryService.updateAnyAccessory(accessory.id, {
              amount: accessory.amount,
            }),
        ),
      );
    }

    if (!body.moneyPaid) body.moneyPaid = body.totalPrice;
    delete body.invoiceDetails;
    delete body.customerFootballIds;
    if (!body.staffId) delete body.staffId;
    const invoiceCreated = await this.invoicesService.updateInvoice(+id, body);

    if (!invoiceCreated)
      throw new HttpException('Cập nhật đơn thất bại', HttpStatus.BAD_REQUEST);

    if (invoiceDetails && invoiceDetails.length > 0) {
      const formattedPayloadInvoiceDetails = invoiceDetails.map(
        ({ amount, price, finalCost, accessoryId }: any) => ({
          amount: Number(amount),
          price,
          finalCost,
          accessoryId,
          invoiceId: invoiceCreated.id,
        }),
      );
      await this.invoicesService.deleteInvoiceDetails(+id);
      await this.invoicesService.createInvoiceDetails(
        formattedPayloadInvoiceDetails,
      );
    }

    return invoiceCreated;
  }

  @Delete(':id/detail')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteInvoiceDetail(@Param('id') id: string) {
    return this.invoicesService.deleteInvoiceDetail(+id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteInvoice(@Param('id') id: string) {
    const invoice = await this.invoicesService.getInvoice(+id);
    if (!invoice)
      throw new HttpException('Không tìm thấy hóa đơn', HttpStatus.BAD_REQUEST);

    await this.invoicesService.deleteInvoiceDetails(+id);
    await this.invoicesService.deleteInvoiceFootballPitchRental(+id);
    return this.invoicesService.deleteInvoice(+id);
  }

  @Get(':id/customer')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getInvoiceByCustomer(@Param('id') id: string, @Query() query: any) {
    const { rentalDate } = query;
    return this.invoicesService.getInvoiceByCustomer(+id, rentalDate);
  }

  @Get(':id/detail')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getInvoiceDetail(@Param('id') id: string) {
    return this.invoicesService.getInvoiceDetail(+id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getInvoice(@Param('id') id: string) {
    const invoice = await this.invoicesService.getInvoice(+id);
    if (!invoice)
      throw new HttpException('Không tìm thấy hóa đơn', HttpStatus.BAD_REQUEST);

    return invoice;
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getInvoices() {
    return this.invoicesService.getInvoices();
  }
}
