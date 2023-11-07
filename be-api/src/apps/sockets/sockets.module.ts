import { Module } from '@nestjs/common';

import { NotificationsService } from '@app/notifications/notifications.service';
import { ChatsService } from '@app/chats/chats.service';
import { SocketsService } from './sockets.service';
import { PrismaService } from '@src/prisma.service';

import { SocketsGateway } from './sockets.gateway';

@Module({
  providers: [
    SocketsGateway,
    PrismaService,
    SocketsService,
    NotificationsService,
    ChatsService,
  ],
})
export class SocketsModule {}
