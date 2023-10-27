import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  UseGuards,
  Body,
  HttpStatus,
  HttpException,
  Param,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import { AccessoriesService } from './accessories.service';
import { UploadService } from 'common/upload/upload.service';

import { PayloadAccessoryTypeDto, PayloadAccessoryDto } from './dtos';

@ApiTags('Accessory')
@Controller('accessories')
export class AccessoriesController {
  constructor(
    private readonly accessoriesService: AccessoriesService,
    private readonly uploadService: UploadService,
  ) {}

  @Get('public')
  getCustomerAccessories() {
    return this.accessoriesService.getAccessories();
  }

  @Post('types')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createAccessoryType(@Body() payloads: PayloadAccessoryTypeDto) {
    return this.accessoriesService.createAccessoryType(payloads);
  }

  @Patch('types/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateAccessoryType(
    @Param('id') id: string,
    @Body() payloads: PayloadAccessoryTypeDto,
  ) {
    const AccessoryType = await this.accessoriesService.getAccessoryType(+id);

    if (!AccessoryType) {
      throw new HttpException(
        'Loại sân bóng này không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.accessoriesService.updateAccessoryType(+id, payloads);
  }

  @Delete('types/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteAccessoryType(@Param('id') id: string) {
    const AccessoryType = await this.accessoriesService.getAccessoryType(+id);

    if (!AccessoryType) {
      throw new HttpException(
        'Loại sân bóng này không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.accessoriesService.deleteAccessoryType(+id);
  }

  @Get('types')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getAccessoryTypes() {
    return this.accessoriesService.getAccessoryTypes();
  }

  @Get('types/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAccessoryType(@Param('id') id: string) {
    const AccessoryType = await this.accessoriesService.getAccessoryType(+id);

    if (!AccessoryType) {
      throw new HttpException(
        'Loại sân bóng này không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }
    return AccessoryType;
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createAccessory(@Body() body: PayloadAccessoryDto, @Request() req) {
    try {
      const { accessoryTypeId, images } = body;
      const { id } = req.user;
      const accessoryTypeFound = await this.accessoriesService.getAccessoryType(
        +accessoryTypeId,
      );
      if (!accessoryTypeFound) {
        throw new HttpException(
          'Loại phụ kiện không hợp lệ!',
          HttpStatus.BAD_REQUEST,
        );
      }

      delete body.images;
      const accessoryCreated = await this.accessoriesService.createAccessory({
        ...body,
        staffId: id,
      });

      if (images) {
        const payloadImages = images.map((image) => ({
          ...image,
          accessoryId: accessoryCreated.id,
        }));
        await this.accessoriesService.createImageAccessory(payloadImages);
      }

      return accessoryCreated;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Thêm phụ kiện thất bại!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateAccessory(
    @Param('id') id: string,
    @Body() body: PayloadAccessoryDto,
    @Request() req,
  ) {
    try {
      const { accessoryTypeId, images } = body;
      const { id: idUser } = req.user;

      const accessory = await this.accessoriesService.getAccessory(+id);
      if (!accessory) {
        throw new HttpException(
          'Phụ kiện không hợp lệ!',
          HttpStatus.BAD_REQUEST,
        );
      }

      const accessoryType = await this.accessoriesService.getAccessoryType(
        +accessoryTypeId,
      );
      if (!accessoryType) {
        throw new HttpException(
          'Loại phụ kiện không hợp lệ!',
          HttpStatus.BAD_REQUEST,
        );
      }

      delete body.images;
      const accessoryCreated = await this.accessoriesService.updateAccessory(
        +id,
        {
          ...body,
          staffId: idUser,
        },
      );

      if (images) {
        const payloadImages = images.map((image) => ({
          ...image,
          accessoryId: accessoryCreated.id,
        }));
        await this.accessoriesService.createImageAccessory(payloadImages);
      }

      return accessoryCreated;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Thêm phụ kiện thất bại!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteAccessory(@Param('id') id: string) {
    try {
      const accessoryImages = await this.accessoriesService.getAccessoryImages(
        +id,
      );
      if (accessoryImages) {
        await accessoryImages.map(async (image) => {
          await this.uploadService.deleteFile(image.url.replace('\\', '/'));
        });

        await this.accessoriesService.deleteAccessoryImages(+id);
      }

      return await this.accessoriesService.deleteAccessory(+id);
    } catch (error) {
      console.log(error);
      throw new HttpException('Xóa phụ kiện thất bại!', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('images/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteAccessoryImage(@Param('id') id: string) {
    const accessoryFile = await this.accessoriesService.getAccessoryImage(+id);
    await this.uploadService.deleteFile(accessoryFile.url.replace('\\', '/'));

    return await this.accessoriesService.deleteAccessoryImage(+id);
  }

  @Get('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAccessory(@Param('id') id: string) {
    const accessory = await this.accessoriesService.getAccessory(+id);

    if (!accessory) {
      throw new HttpException(
        'Không tìm thấy thông tin phụ kiện',
        HttpStatus.BAD_REQUEST,
      );
    }
    return accessory;
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getAccessories() {
    return this.accessoriesService.getAccessories();
  }
}
