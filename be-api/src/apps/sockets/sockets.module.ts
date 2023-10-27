import { Module } from '@nestjs/common';

import { SocketsService } from './sockets.service';
import { NotificationService } from './notification.service';
import { ContactService } from './contact.service';
import { PrismaService } from '@src/prisma.service';

import { SocketsGateway } from './sockets.gateway';

@Module({
  providers: [SocketsGateway, PrismaService, SocketsService, NotificationService, ContactService],
})
export class SocketsModule {}
