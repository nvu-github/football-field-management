import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';

import { NotificationsService } from './notifications.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notification')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getNotifications() {
    return this.notificationsService.getNotifications();
  }
}
