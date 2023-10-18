import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { PrismaService } from '@src/prisma.service';
import { UsersController } from './users.controller';
import { PaymentService } from 'common/payment/payment.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, PaymentService],
})
export class UsersModule {}
