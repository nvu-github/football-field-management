import {
  Controller,
  Get,
  UseGuards,
  Body,
  Request,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';

import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { EvaluationsService } from './evaluations.service';

@ApiTags('Evaluation')
@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createEvaluation(@Request() req: any, @Body() body: any) {
    const { customerId } = req.user;

    if (!customerId)
      throw new HttpException(
        'Có lỗi xảy ra, vui lòng thử lại!',
        HttpStatus.BAD_REQUEST,
      );

    return this.evaluationsService.createEvaluation({ ...body, customerId });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateEvaluation(
    @Param('id') id: string,
    @Request() req: any,
    @Body() body: any,
  ) {
    const { customerId } = req.user;
    const evaluationFound = await this.evaluationsService.getEvaluation(+id);

    if (!customerId)
      throw new HttpException(
        'Có lỗi xảy ra, vui lòng thử lại!',
        HttpStatus.BAD_REQUEST,
      );

    if (!evaluationFound)
      throw new HttpException(
        'Đánh giá này không tồn tại!',
        HttpStatus.BAD_REQUEST,
      );

    return this.evaluationsService.updateEvaluation(+id, {
      ...body,
      customerId,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async deleteEvaluation(@Param('id') id: string) {
    const evaluationFound = await this.evaluationsService.getEvaluation(+id);

    if (!evaluationFound)
      throw new HttpException(
        'Đánh giá này không tồn tại!',
        HttpStatus.BAD_REQUEST,
      );

    return this.evaluationsService.deleteEvaluation(+id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getEvaluation(@Param('id') id: string) {
    const evaluationFound = await this.evaluationsService.getEvaluation(+id);

    if (!evaluationFound)
      throw new HttpException(
        'Đánh giá này không tồn tại!',
        HttpStatus.BAD_REQUEST,
      );

    return evaluationFound;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getEvaluations() {
    return this.evaluationsService.getEvaluations();
  }
}
