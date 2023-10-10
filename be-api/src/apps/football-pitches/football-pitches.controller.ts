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
} from '@nestjs/common';
import { FootballPitchesService } from './football-pitches.service';

import { ParamFootballPitchType, ParamLeasingDurationDto } from './dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('FootballPitch')
@Controller('football-pitches')
export class FootballPitchesController {
  constructor(private readonly footballFieldsService: FootballPitchesService) {}

  @Get()
  getFootballPitches() {
    return this.footballFieldsService.getFootballPitches();
  }

  @Post('leasing-durations')
  createLeasingDuration(@Body() params: ParamLeasingDurationDto) {
    return this.footballFieldsService.createLeasingDuration(params);
  }

  @Patch('leasing-durations/:id')
  async updateLeasingDuration(
    @Param('id') id: string,
    @Body() params: ParamLeasingDurationDto,
  ) {
    const leasingDuration = await this.footballFieldsService.getLeasingDuration(
      +id,
    );

    if (!leasingDuration) {
      throw new HttpException(
        'Thời gian thuê không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.footballFieldsService.updateLeasingDuration(+id, params);
  }

  @Delete('leasing-durations/:id')
  async deleteLeasingDuration(@Param('id') id: string) {
    const leasingDuration = await this.footballFieldsService.getLeasingDuration(
      +id,
    );

    if (!leasingDuration) {
      throw new HttpException(
        'Thời gian thuê không tồn tại',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.footballFieldsService.deleteLeasingDuration(+id);
  }

  @Get('leasing-durations')
  getLeasingDurations() {
    return this.footballFieldsService.getLeasingDurations();
  }

  @Get('leasing-durations/:id')
  async getLeasingDuration(@Param('id') id: string) {
    const leasingDuration = await this.footballFieldsService.getLeasingDuration(
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

  @Post('football-pitch-types')
  createFootballFieldType(@Body() params: ParamFootballPitchType) {
    return this.footballFieldsService.createFootballFieldType(params);
  }

  @Patch('football-pitch-types/:id')
  async updateFootballFieldType(
    @Param('id') id: string,
    @Body() params: ParamFootballPitchType,
  ) {
    const footballFieldType =
      await this.footballFieldsService.getFootballFieldType(+id);

    if (!footballFieldType) {
      throw new HttpException(
        'Loại sân bóng này không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.footballFieldsService.updateFootballFieldType(+id, params);
  }

  @Delete('football-pitch-types/:id')
  async deleteFootballFieldType(@Param('id') id: string) {
    const footballFieldType =
      await this.footballFieldsService.getFootballFieldType(+id);

    if (!footballFieldType) {
      throw new HttpException(
        'Loại sân bóng này không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.footballFieldsService.deleteFootballFieldType(+id);
  }

  @Get('football-pitch-types')
  getFootballFieldTypes() {
    return this.footballFieldsService.getFootballFieldTypes();
  }

  @Get('football-pitch-types/:id')
  async getFootballFieldType(@Param('id') id: string) {
    const footballFieldType =
      await this.footballFieldsService.getFootballFieldType(+id);

    if (!footballFieldType) {
      throw new HttpException(
        'Loại sân bóng này không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }
    return footballFieldType;
  }
}
