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
      createdAt,
      email: customer.account.email,
    };
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
      },
    });
  }

  async getChatCustomerInfoForAdmin(): Promise<any> {
    const customerContacts = await this.prisma.$queryRaw`
      SELECT
      cu.id ,
      cu.name
      FROM
        contacts AS c
      INNER JOIN
        customers AS cu
      ON
        c.customer_id = cu.id
      GROUP BY
        cu.id
    `;

    return customerContacts;
  }
}
