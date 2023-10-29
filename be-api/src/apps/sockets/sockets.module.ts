import { Module } from '@nestjs/common';

import { NotificationsService } from '@app/notifications/notifications.service';
import { SocketsService } from './sockets.service';
import { ContactService } from './contact.service';
import { PrismaService } from '@src/prisma.service';

import { SocketsGateway } from './sockets.gateway';

@Module({
  providers: [
    SocketsGateway,
    PrismaService,
    SocketsService,
    NotificationsService,
    ContactService,
  ],
})
export class SocketsModule {}
