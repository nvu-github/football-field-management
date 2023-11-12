import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {}

  async createChat(payloadChat: any): Promise<any> {
    const chatCreated = await this.prisma.contact.create({
      data: {
        ...payloadChat,
      },
      select: {
        id: true,
        content: true,
        image: true,
        staffId: true,
        customerId: true,
        active: true,
        status: true,
        createdAt: true,
        customer: {
          select: {
            name: true,
            account: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });
    const {
      id,
      content,
      image,
      staffId,
      customerId,
      active,
      status,
      createdAt,
      customer,
    } = chatCreated;
    return {
      id,
      content,
      image,
      staffId,
      customerId,
      customerName: customer.name,
      active,
      status,
      createdAt,
      email: customer.account.email,
    };
  }

  updateStatusChat(customerId: number): Promise<any> {
    return this.prisma.contact.updateMany({
      where: {
        customerId,
      },
      data: {
        status: 'SEEN',
      },
    });
  }

  getChats(customerId: number): Promise<any> {
    return this.prisma.contact.findMany({
      where: {
        customerId,
      },
      select: {
        id: true,
        content: true,
        image: true,
        staffId: true,
        customerId: true,
        active: true,
        createdAt: true,
        status: true,
      },
    });
  }

  async getChatCustomerInfo(customerId?: number): Promise<any> {
    const customerInfo = await this.prisma.customer.findMany({
      select: {
        id: true,
        name: true,
        contact: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (customerId) {
      return customerInfo.find(({ id }) => id === customerId) || {};
    }

    return (
      customerInfo
        .filter(({ contact }) => contact.length > 0)
        .map(({ id, name, contact }) => {
          const chatStatusUnreadFound = contact.filter(
            ({ status }: any) => status === 'UNREAD',
          );

          return {
            id,
            name,
            totalUnread:
              chatStatusUnreadFound && chatStatusUnreadFound.length > 0
                ? chatStatusUnreadFound.length
                : 0,
          };
        }) || []
    );
  }
}
