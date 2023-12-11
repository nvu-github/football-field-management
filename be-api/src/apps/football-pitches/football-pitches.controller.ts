import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  HttpStatus,
  Delete,
  Get,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { FootballPitchesService } from './football-pitches.service';
import { UploadService } from 'common/upload/upload.service';
import { AccessoriesService } from '@app/accessories/accessories.service';
import { InvoicesService } from '@app/invoices/invoices.service';
import { MailService } from 'common/mail/mail.service';

import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';

import { format, parseISO } from 'date-fns';

import { mergeAccessoryRental } from 'utils/app';

import {
  PayloadFootballPitchTypeDto,
  PayloadLeasingDurationDto,
  PayloadFootballPitchDto,
  PayloadFootballPitchPriceDto,
  PayloadCustomerRentalDto,
} from './dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Football Pitch')
@Controller('football-pitches')
export class FootballPitchesController {
  constructor(
    private readonly footballPitchService: FootballPitchesService,
    private readonly uploadService: UploadService,
    private readonly accessoryService: AccessoriesService,
    private readonly invoiceService: InvoicesService,
    private readonly mailService: MailService,
  ) {}

  @Get('leasing-durations/public')
  getLeasingDurationsPublic() {
    return this.footballPitchService.getLeasingDurations();
  }

  @Get('rental/all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getAllCustomerFootballPitchRental() {
    return this.footballPitchService.getFootballPitchRentals();
  }

  @Post('customer/rental')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createCustomerFootballPitchRental(
    @Body() body: PayloadCustomerRentalDto,
    @Request() req: any,
  ): Promise<any> {
    const { customerId } = req.user;
    const { customerAccessoryRentals } = body;

    delete body.customerAccessoryRentals;
    const customerFootballPitchRental =
      await this.footballPitchService.createCustomerFootballPitchRental({
        ...body,
        footballPitchLeasingDurationId: body.leasingDurationId,
        status: 'PENDING',
        customerId,
        rentalDate: parseISO(body.rentalDate),
      });

    const payloadCustomerAccessoryRental = customerAccessoryRentals.map(
      (accessory) => ({
        accessoryId: accessory.accessoryId,
        amount: Number(accessory.amount),
        customerFootballPitchRentalId: customerFootballPitchRental.id,
      }),
    );

    await this.footballPitchService.createAccessoryFootballPitchRental(
      payloadCustomerAccessoryRental,
    );

    return customerFootballPitchRental;
  }

  @Get('rental/:id/detail')
  async getFootballPitchRentalDetail(@Param('id') id: string) {
    const footballPitchRentalFound =
      await this.footballPitchService.getCustomerFootballPitchRentalConfirmDetail(
        +id,
      );

    if (!footballPitchRentalFound)
      throw new HttpException(
        'Không tìm thấy thông tin đặt sân',
        HttpStatus.BAD_REQUEST,
      );

    return footballPitchRentalFound;
  }

  @Patch('rental/:id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateStatusFootballPitchRental(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const footballPitchRentalFound =
      await this.footballPitchService.getCustomerFootballPitchRentalSingle(+id);

    if (footballPitchRentalFound.length === 0) {
      throw new HttpException(
        'Không tìm thấy thông tin đặt sân',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (body.status === 'ACCEPT') {
      const dataAmountAccessories = await Promise.all(
        footballPitchRentalFound.invoice.invoiceDetail.map(
          async (accessory: any) => {
            const amountAccessory = await this.accessoryService.getAccessory(
              accessory.accessoryId,
            );
            return {
              id: accessory.accessoryId,
              amount: amountAccessory.amount - accessory.amount,
            };
          },
        ),
      );

      await Promise.all(
        dataAmountAccessories.map(
          async (accessory) =>
            await this.accessoryService.updateAnyAccessory(accessory.id, {
              amount: accessory.amount,
            }),
        ),
      );

      await this.mailService.sendMail({
        to: footballPitchRentalFound.customer.account.email,
        from: 'nguyenuc0911@gmail.com',
        subject: 'Thông báo đặt lịch sân bóng Hoàng Quân',
        template: 'customerFootballPitchRental',
        data: {
          ...footballPitchRentalFound,
          status: body.status,
          message: 'Quý khách đã đặt sân thành công!',
          rentalDate: format(
            new Date(footballPitchRentalFound.rentalDate),
            'dd/MM/yyyy',
          ),
        },
      });
    }

    if (body.status === 'REJECT') {
      let payloadInvoice = null;

      const accessoryPriceTotal =
        footballPitchRentalFound.accessoryRentals &&
        footballPitchRentalFound.accessoryRentals.length > 0
          ? footballPitchRentalFound.accessoryRentals.reduce((total, item) => {
              return total + Number(item.price) * Number(item.amount);
            }, 0)
          : 0;

      const totalPrice =
        Number(footballPitchRentalFound.invoice.totalPrice) -
        Number(footballPitchRentalFound.price) -
        Number(accessoryPriceTotal);

      // const moneyPaid =
      //   Number(footballPitchRentalFound.invoice.totalPrice) ==
      //   Number(footballPitchRentalFound.invoice.moneyPaid)
      //     ? Number(footballPitchRentalFound.invoice.moneyPaid) -
      //       Number(totalPrice)
      //     : Number(footballPitchRentalFound.invoice.moneyPaid);

      if (totalPrice > 0) payloadInvoice = { totalPrice };
      else payloadInvoice = { status: 'CANCELED' };

      await this.invoiceService.updateInvoice(
        footballPitchRentalFound.invoice.id,
        payloadInvoice,
      );

      await this.mailService.sendMail({
        to: footballPitchRentalFound.customer.account.email,
        from: 'nguyenuc0911@gmail.com',
        subject: 'Thông báo đặt lịch sân bóng Hoàng Quân',
        template: 'customerFootballPitchRental',
        data: {
          ...footballPitchRentalFound,
          status: body.status,
          message: 'Quý khách đã hủy đặt sân thành công!',
          rentalDate: format(
            new Date(footballPitchRentalFound.rentalDate),
            'dd/MM/yyyy',
          ),
        },
      });
    }

    return this.footballPitchService.updateStatusFootballPitchRental(
      +id,
      body.status,
    );
  }

  @Patch('rental/:id/accessory')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateAccessoryFootballPitchRental(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const { invoiceId, payloadAccessoryRentals } = body;
    const payloadCustomerAccessoryRental = payloadAccessoryRentals.map(
      (accessory) => ({
        accessoryId: accessory.accessoryId,
        amount: Number(accessory.amount),
        customerFootballPitchRentalId: Number(id),
      }),
    );

    await this.footballPitchService.deleteAccessoryRentals(+id);
    await this.footballPitchService.createAccessoryFootballPitchRental(
      payloadCustomerAccessoryRental,
    );

    const invoice = await this.invoiceService.getInvoice(+invoiceId);
    const customerFootballPitchIds =
      await this.invoiceService.getCustomerFootballIdByInvoiceId(+invoiceId);
    const accessoryRentals =
      await this.footballPitchService.getAccessoryRentalCustomerByCustomerFootballPitchId(
        customerFootballPitchIds,
      );

    const payloadInvoiceDetails: any = mergeAccessoryRental(
      accessoryRentals.map((accessoryRental) => {
        return {
          accessoryId: accessoryRental.accessoryId,
          amount: accessoryRental.amount,
          price: Number(accessoryRental.accessory.price),
          finalCost:
            Number(accessoryRental.accessory.price) *
            Number(accessoryRental.amount),
          invoiceId,
        };
      }),
    );

    const totalFinalCostInvoiceDetail = payloadInvoiceDetails.reduce(
      (total, item) => {
        return total + Number(item.finalCost);
      },
      0,
    );

    const totalFinalCostInvoiceDetailOld = invoice.invoiceDetails.reduce(
      (total, item) => {
        return total + Number(item.finalCost);
      },
      0,
    );

    const payloadInvoiceUpdate = {
      totalPrice:
        invoice.totalPrice -
        totalFinalCostInvoiceDetailOld +
        totalFinalCostInvoiceDetail,
    };

    await this.invoiceService.updateInvoice(+invoiceId, payloadInvoiceUpdate);
    await this.invoiceService.deleteInvoiceDetails(+invoiceId);
    await this.invoiceService.createInvoiceDetails(payloadInvoiceDetails);

    return HttpStatus.OK;
  }

  @Get('rental/info')
  async getFootballPitchRentalNows(@Query() query: any): Promise<any> {
    const { rentalDate } = query;
    return await this.footballPitchService.getFootballPitchRentalNows(
      rentalDate,
    );
  }

  @Get('rental/confirm')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getCustomerFootballPitchConfirmRentals(): Promise<any> {
    return await this.footballPitchService.getCustomerFootballPitchConfirmRentals();
  }

  @Get('rental/check')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async checkCustomerFootballPitchConfirmRental(
    @Query() query?: any,
  ): Promise<any> {
    return await this.footballPitchService.checkCustomerFootballPitchConfirmRental(
      query,
    );
  }

  @Get('rental/customer/histories')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getFootballPitchRentalCustomer(@Request() req: any): Promise<any> {
    const { customerId } = req.user;
    return await this.footballPitchService.getFootballPitchCustomerRentalHistories(
      +customerId,
    );
  }

  @Post('types')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createFootballPitchType(@Body() payloads: PayloadFootballPitchTypeDto) {
    return this.footballPitchService.createFootballPitchType(payloads);
  }

  @Patch('types/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateFootballPitchType(
    @Param('id') id: string,
    @Body() payloads: PayloadFootballPitchTypeDto,
  ) {
    const footballPitchType =
      await this.footballPitchService.getFootballPitchType(+id);

    if (!footballPitchType) {
      throw new HttpException(
        'Loại sân bóng này không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.footballPitchService.updateFootballPitchType(+id, payloads);
  }

  @Delete('types/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteFootballPitchType(@Param('id') id: string) {
    const footballPitchType =
      await this.footballPitchService.getFootballPitchType(+id);

    if (!footballPitchType) {
      throw new HttpException(
        'Loại sân bóng này không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.footballPitchService.deleteFootballPitchType(+id);
  }

  @Get('types')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getFootballPitchTypes() {
    return this.footballPitchService.getFootballPitchTypes();
  }

  @Get('types/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getFootballPitchType(@Param('id') id: string) {
    const footballPitchType =
      await this.footballPitchService.getFootballPitchType(+id);

    if (!footballPitchType) {
      throw new HttpException(
        'Loại sân bóng này không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }
    return footballPitchType;
  }

  @Post('prices')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createFootballPitchPrice(
    @Body() payloads: PayloadFootballPitchPriceDto,
  ) {
    const { footballPitchId, leasingDurationId } = payloads;

    const footballPitchFound = await this.footballPitchService.getFootballPitch(
      +footballPitchId,
    );
    if (!footballPitchFound)
      throw new HttpException('Sân bóng không hợp lệ', HttpStatus.BAD_REQUEST);

    const leasingDurationFound =
      await this.footballPitchService.getLeasingDuration(+leasingDurationId);
    if (!leasingDurationFound)
      throw new HttpException(
        'Khung thời gian không hợp lệ',
        HttpStatus.BAD_REQUEST,
      );

    return this.footballPitchService.createFootballPitchPrice(payloads);
  }

  @Patch('prices/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateFootballPitchPrice(
    @Param('id') id: string,
    @Body() payloads: PayloadFootballPitchPriceDto,
  ) {
    const { footballPitchId, leasingDurationId } = payloads;

    const footballPitchPrice =
      await this.footballPitchService.getFootballPitchPrice(+id);

    if (!footballPitchPrice)
      throw new HttpException(
        'Giá thuê sân bóng không hợp lệ',
        HttpStatus.BAD_REQUEST,
      );

    const footballPitchFound = await this.footballPitchService.getFootballPitch(
      +footballPitchId,
    );
    if (!footballPitchFound)
      throw new HttpException('Sân bóng không hợp lệ', HttpStatus.BAD_REQUEST);

    const leasingDurationFound =
      await this.footballPitchService.getLeasingDuration(+leasingDurationId);
    if (!leasingDurationFound)
      throw new HttpException(
        'Khung thời gian không hợp lệ',
        HttpStatus.BAD_REQUEST,
      );

    return this.footballPitchService.updateFootballPitchPrice(+id, payloads);
  }

  @Delete('prices/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteFootballPitchPrice(@Param('id') id: string) {
    const footballPitchPrice =
      await this.footballPitchService.getFootballPitchPrice(+id);

    if (!footballPitchPrice)
      throw new HttpException(
        'Giá thuê sân bóng không hợp lệ',
        HttpStatus.BAD_REQUEST,
      );
    return this.footballPitchService.deleteFootballPitchPrice(+id);
  }

  @Get('prices/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getFootballPitchPrice(@Param('id') id: string) {
    const footballPitchPrice =
      await this.footballPitchService.getFootballPitchPrice(+id);

    if (!footballPitchPrice)
      throw new HttpException(
        'Giá thuê sân bóng không hợp lệ',
        HttpStatus.BAD_REQUEST,
      );
    return footballPitchPrice;
  }

  @Get('prices')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getFootballPitchPrices() {
    return this.footballPitchService.getFootballPitchPrices();
  }

  @Post('leasing-durations')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createLeasingDuration(@Body() payloads: PayloadLeasingDurationDto) {
    return this.footballPitchService.createLeasingDuration(payloads);
  }

  @Patch('leasing-durations/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateLeasingDuration(
    @Param('id') id: string,
    @Body() payloads: PayloadLeasingDurationDto,
  ) {
    const leasingDuration = await this.footballPitchService.getLeasingDuration(
      +id,
    );

    if (!leasingDuration) {
      throw new HttpException(
        'Thời gian thuê không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.footballPitchService.updateLeasingDuration(+id, payloads);
  }

  @Delete('leasing-durations/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteLeasingDuration(@Param('id') id: string) {
    const leasingDuration = await this.footballPitchService.getLeasingDuration(
      +id,
    );

    if (!leasingDuration) {
      throw new HttpException(
        'Thời gian thuê không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.footballPitchService.deleteLeasingDuration(+id);
  }

  @Get('leasing-durations')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getLeasingDurations() {
    return this.footballPitchService.getLeasingDurations();
  }

  @Get('leasing-durations/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getLeasingDuration(@Param('id') id: string) {
    const leasingDuration = await this.footballPitchService.getLeasingDuration(
      +id,
    );

    if (!leasingDuration) {
      throw new HttpException(
        'Thời gian thuê không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    }
    return leasingDuration;
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createFootballPitch(
    @Body() body: PayloadFootballPitchDto,
    @Request() req,
  ) {
    try {
      const { footballTypeId, images } = body;
      const { id } = req.user;
      const footballPitchType =
        await this.footballPitchService.getFootballPitchType(+footballTypeId);
      if (!footballPitchType) {
        throw new HttpException(
          'Loại sân bóng không hợp lệ!',
          HttpStatus.BAD_REQUEST,
        );
      }

      delete body.images;
      const footballPitchCreated =
        await this.footballPitchService.createFootballPitch({
          ...body,
          staffId: id,
        });

      if (images) {
        const payloadImages = images.map((image) => ({
          ...image,
          footballPitchId: footballPitchCreated.id,
        }));
        await this.footballPitchService.createImageFootballPitch(payloadImages);
      }

      return footballPitchCreated;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Thêm sân bóng thất bại!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateFootballPitch(
    @Param('id') id: string,
    @Body() body: PayloadFootballPitchDto,
    @Request() req,
  ) {
    try {
      const { footballTypeId, images } = body;
      const { id: idUser } = req.user;

      const footballPitch = await this.footballPitchService.getFootballPitch(
        +id,
      );
      if (!footballPitch) {
        throw new HttpException(
          'Sân bóng không hợp lệ!',
          HttpStatus.BAD_REQUEST,
        );
      }

      const footballPitchType =
        await this.footballPitchService.getFootballPitchType(+footballTypeId);
      if (!footballPitchType) {
        throw new HttpException(
          'Loại sân bóng không hợp lệ!',
          HttpStatus.BAD_REQUEST,
        );
      }

      delete body.images;
      const footballPitchCreated =
        await this.footballPitchService.updateFootballPitch(+id, {
          ...body,
          staffId: idUser,
        });

      if (images) {
        const payloadImages = images.map((image) => ({
          ...image,
          footballPitchId: footballPitchCreated.id,
        }));
        await this.footballPitchService.createImageFootballPitch(payloadImages);
      }

      return footballPitchCreated;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Thêm sân bóng thất bại!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteFootballPitch(@Param('id') id: string) {
    try {
      const footballPitchImages =
        await this.footballPitchService.getFootballPitchImages(+id);
      if (footballPitchImages) {
        await footballPitchImages.map(async (image) => {
          await this.uploadService.deleteFile(image.url.replace('\\', '/'));
        });

        await this.footballPitchService.deleteFootballPitchImages(+id);
      }

      return await this.footballPitchService.deleteFootballPitch(+id);
    } catch (error) {
      console.log(error);
      throw new HttpException('Xóa sân bóng thất bại!', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('images/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteFootballPitchImage(@Param('id') id: string) {
    const footballPitchFile =
      await this.footballPitchService.getFootballPitchImage(+id);
    await this.uploadService.deleteFile(
      footballPitchFile.url.replace('\\', '/'),
    );

    return await this.footballPitchService.deleteFootballPitchImage(+id);
  }

  @Get('/:id')
  async getFootballPitch(@Param('id') id: string) {
    const footballPitch = await this.footballPitchService.getFootballPitch(+id);

    if (!footballPitch) {
      throw new HttpException(
        'Không tìm thấy thông tin sân bóng',
        HttpStatus.BAD_REQUEST,
      );
    }
    return footballPitch;
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getFootballPitches() {
    return this.footballPitchService.getFootballPitches();
  }
}
