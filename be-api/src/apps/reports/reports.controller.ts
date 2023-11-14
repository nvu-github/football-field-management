import { ApiTags } from '@nestjs/swagger';
import { Controller, UseGuards, Get } from '@nestjs/common';

import { ReportsService } from './reports.service';

import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';

@ApiTags('Report')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
  
  @Get('accessories')
  getReportAccessory() {
    return this.reportsService.getReportAccessories();
  }

  @Get('evaluation')
  getReportEvaluation() {
    return this.reportsService.getReportEvaluations();
  }

  @Get('rental-field')
  getReportRentalField() {
    return this.reportsService.getReportRentalFields();
  }

  @Get('revenue')
  getReportRevenue() {
    return this.reportsService.getReportRevenues();
  }
}
