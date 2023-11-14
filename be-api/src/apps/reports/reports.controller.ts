import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, Get, Query } from '@nestjs/common';

import { ReportsService } from './reports.service';

import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';

@ApiTags('Report')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('accessories')
  getReportAccessory(@Query() query: any) {
    return this.reportsService.getReportAccessories(query);
  }

  @Get('evaluation')
  getReportEvaluation(@Query() query: any) {
    return this.reportsService.getReportEvaluations(query);
  }

  @Get('rental-field')
  getReportRentalField(@Query() query: any) {
    return this.reportsService.getReportRentalFields(query);
  }

  @Get('revenue')
  getReportRevenue(@Query() query: any) {
    return this.reportsService.getReportRevenues(query);
  }
}
