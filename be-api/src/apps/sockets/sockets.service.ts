import { Injectable } from '@nestjs/common';

import { PrismaService } from '@src/prisma.service';

@Injectable()
export class SocketsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCustomerIdByEmail(email: string): Promise<any> {
    const customerInfor = await this.prisma.account.findUnique({
      where: {
        email,
      },
      select: {
        customer: {
          select: {
            id: true,
          },
        },
      },
    });
    return customerInfor.customer.id;
  }
}
