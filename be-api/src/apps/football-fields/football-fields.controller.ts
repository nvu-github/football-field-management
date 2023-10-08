import { Controller, Post, Body, Patch, Param, HttpException, HttpStatus, Delete, Get } from '@nestjs/common';
import { FootballFieldsService } from './football-fields.service';

import { ParamFootbalFieldType, ParamLeasingDurationDto } from './dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('FootballField')
@Controller('football-fields')
export class FootballFieldsController {
  constructor(private readonly footballFieldsService: FootballFieldsService) {}

  @Post('leasing-durations')
  createLeasingDuration(@Body() params: ParamLeasingDurationDto) {
    return this.footballFieldsService.createLeasingDuration(params);
  }

  @Patch('leasing-durations/:id')
  async updateLeasingDuration(@Param('id') id: string, @Body() params: ParamLeasingDurationDto) {
    const leasingDuration = await this.footballFieldsService.getLeasingDuration(+id)

    if(!leasingDuration) {
      throw new HttpException('Thời gian thuê không tồn tại', HttpStatus.BAD_REQUEST)
    }

    return this.footballFieldsService.updateLeasingDuration(+id, params);
  }

  @Delete('leasing-durations/:id')
  async deleteLeasingDuration(@Param('id') id: string) {
    const leasingDuration = await this.footballFieldsService.getLeasingDuration(+id)

    if(!leasingDuration) {
      throw new HttpException('Thời gian thuê không tồn tại', HttpStatus.BAD_REQUEST)
    }

    return this.footballFieldsService.deleteLeasingDuration(+id);
  }

  @Get('leasing-durations')
  getLeasingDurations() {
    return this.footballFieldsService.getLeasingDurations();
  }

  @Get('leasing-durations/:id')
  async getLeasingDuration(@Param('id') id: string) {
    const leasingDuration = await this.footballFieldsService.getLeasingDuration(+id)

    if(!leasingDuration) {
      throw new HttpException('Thời gian thuê không tồn tại', HttpStatus.BAD_REQUEST)
    }
    return leasingDuration;
  }

  @Post('football-field-types')
  createFootballFieldType(@Body() params: ParamFootbalFieldType) {
    return this.footballFieldsService.createFootballFieldType(params);
  }

  @Patch('football-field-types/:id')
  async updateFootballFieldType(@Param('id') id: string, @Body() params: ParamFootbalFieldType) {
    const footballFieldType = await this.footballFieldsService.getFootballFieldType(+id);
    
    if (!footballFieldType) {
      throw new HttpException('Loại sân bóng này không tồn tại', HttpStatus.NOT_FOUND)
    }
    return this.footballFieldsService.updateFootballFieldType(+id, params);
  }

  @Delete('football-field-types/:id')
  async deleteFootballFieldType(@Param('id') id: string) {
    const footballFieldType = await this.footballFieldsService.getFootballFieldType(+id);
    
    if (!footballFieldType) {
      throw new HttpException('Loại sân bóng này không tồn tại', HttpStatus.NOT_FOUND)
    }

    return this.footballFieldsService.deleteFootballFieldType(+id);
  }

  @Get('football-field-types')
  getFootballFieldTypes() {  
    return this.footballFieldsService.getFootballFieldTypes();
  }

  @Get('football-field-types/:id')
  async getFootballFieldType(@Param('id') id: string) {
    const footballFieldType = await this.footballFieldsService.getFootballFieldType(+id);
    
    if (!footballFieldType) {
      throw new HttpException('Loại sân bóng này không tồn tại', HttpStatus.NOT_FOUND)
    }
    return footballFieldType;
  }
}
