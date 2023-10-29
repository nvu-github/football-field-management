import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(payload: any): Promise<any> {
    const createdNotification = await this.prisma.notification.create({
      data: {
        ...payload,
      },
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        customer: {
          select: {
            name: true,
          },
        },
      },
    });
    const { id, title, content, status, customer } = createdNotification;
    return {
      id,
      title,
      content,
      status,
      customerName: customer.name,
    };
  }

  async getNotifications(): Promise<any> {
    const notifications = await this.prisma.notification.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        customer: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return notifications.map((notification) => {
      const { id, title, content, status, customer } = notification;
      return {
        id,
        title,
        content,
        status,
        customerId: customer.id,
        customerName: customer.name,
        customerAvatar: customer.avatar,
      };
    });
  }
}
