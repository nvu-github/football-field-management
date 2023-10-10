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
} from '@nestjs/common';
import { FootballPitchesService } from './football-pitches.service';

import {
  ParamFootballPitchType,
  ParamLeasingDurationDto,
  ParamFootballPitchDto,
} from './dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('FootballPitch')
@Controller('football-pitches')
export class FootballPitchesController {
  constructor(private readonly footballPitchService: FootballPitchesService) {}

  @Post()
  async createFootballPitch(
    @Body() body: ParamFootballPitchDto,
    @Request() req,
  ) {
    const { typeId } = body;
    const { id } = req.user;
    const footballPitchType =
      await this.footballPitchService.getFootballPitchType(+typeId);
    if (!footballPitchType) {
      throw new HttpException(
        'Loại sân bóng không hợp lệ!',
        HttpStatus.BAD_REQUEST,
      );
    }

    delete body.images;
    return this.footballPitchService.createFootballPitch({
      ...body,
      staffId: id,
    });
  }

  @Get()
  getFootballPitches() {
    return this.footballPitchService.getFootballPitches();
  }

  @Post('leasing-durations')
  createLeasingDuration(@Body() params: ParamLeasingDurationDto) {
    return this.footballPitchService.createLeasingDuration(params);
  }

  @Patch('leasing-durations/:id')
  async updateLeasingDuration(
    @Param('id') id: string,
    @Body() params: ParamLeasingDurationDto,
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

    return this.footballPitchService.updateLeasingDuration(+id, params);
  }

  @Delete('leasing-durations/:id')
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
  getLeasingDurations() {
    return this.footballPitchService.getLeasingDurations();
  }

  @Get('leasing-durations/:id')
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

  @Post('football-pitch-types')
  createFootballPitchType(@Body() params: ParamFootballPitchType) {
    return this.footballPitchService.createFootballPitchType(params);
  }

  @Patch('football-pitch-types/:id')
  async updateFootballPitchType(
    @Param('id') id: string,
    @Body() params: ParamFootballPitchType,
  ) {
    const footballPitchType =
      await this.footballPitchService.getFootballPitchType(+id);

    if (!footballPitchType) {
      throw new HttpException(
        'Loại sân bóng này không tồn tại',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.footballPitchService.updateFootballPitchType(+id, params);
  }

  @Delete('football-pitch-types/:id')
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

  @Get('football-pitch-types')
  getFootballPitchTypes() {
    return this.footballPitchService.getFootballPitchTypes();
  }

  @Get('football-pitch-types/:id')
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
}
