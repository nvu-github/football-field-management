import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';

import { PayloadNotificationDto } from './dtos';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) { }

  createNotification(payload: PayloadNotificationDto): Promise<any> {
    return this.prisma.notification.create({
      data: {
        ...payload
      }
    })
  }
}
