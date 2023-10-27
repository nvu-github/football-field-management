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
import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';

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
  ) {}

  @Get('leasing-durations/public')
  getLeasingDurationsPublic() {
    return this.footballPitchService.getLeasingDurations();
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

  @Get('rental')
  async getFootballPitchRentals(): Promise<any> {
    return await this.footballPitchService.getFootballPitchRentals();
  }

  @Get('rental/info')
  async getFootballPitchRentalNows(@Query() query: any): Promise<any> {
    const { rentalDate } = query
    return await this.footballPitchService.getFootballPitchRentalNows(rentalDate);
  }

  @Get('rental/customer/histories')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getFootballPitchRentalCustomer(@Request() req: any): Promise<any> {
    const { customerId } = req.user;
    return await this.footballPitchService.getFootballPitchCustomerRentalHistories(+customerId);
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
