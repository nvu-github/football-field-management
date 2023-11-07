import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';

@Injectable()
export class ChatsService {
  constructor(private readonly prisma: PrismaService) {}

  createChat(payloadChat: any): Promise<any> {
    return this.prisma.contact.create({
      data: {
        ...payloadChat,
      },
    });
  }

  getCustomerChats(customerId: number) {
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
      },
    });
  }
}
