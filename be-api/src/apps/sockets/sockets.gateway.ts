import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Request, UseGuards, HttpStatus, HttpException } from '@nestjs/common';

import { SocketsService } from './sockets.service';
import { ChatsService } from '@app/chats/chats.service';
import { NotificationsService } from '@app/notifications/notifications.service';
import { WsJwtAuthGuard } from '@app/auth/ws-jwt.guard';

import { PayloadNotificationDto } from './dtos';

import configuration from 'config/configuration';
const whitelist = configuration().whitelistOrigins;

@WebSocketGateway(Number(configuration().portSocket), {
  namespace: 'sockets',
  cors: {
    origin: function (origin, callback) {
      if (
        !whitelist ||
        whitelist.length == 0 ||
        whitelist.indexOf(origin) !== -1
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  },
})
export class SocketsGateway implements OnGatewayConnection {
  constructor(
    private readonly socketsService: SocketsService,
    private readonly notificationService: NotificationsService,
    private readonly chatService: ChatsService,
  ) {}

  handleConnection(client) {
    console.log(`Connected with ID: ${client.id}`);
  }

  @WebSocketServer() server;

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('notification')
  async gatewayNotification(
    @MessageBody() body: PayloadNotificationDto,
    @Request() req: any,
  ) {
    const { customerId } = req.handshake.user;
    const { title, content, status } = body;

    if (!title || !content || !status) {
      throw new HttpException(
        'Vui lòng nhập đầy đủ thông tin',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdNotification =
      await this.notificationService.createNotification({
        ...body,
        customerId,
        staffId: 1,
      });
    return this.server.emit('emit-notification', createdNotification);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('chat')
  async gatewayChat(@MessageBody() body: any, @Request() req: any) {
    const { customerId: customerIdReq, staffId: staffIdReq } =
      req.handshake.user;
    const { content, staffId, customerId, active } = body;

    if (!customerId) body.customerId = customerIdReq;
    if (!staffId) body.staffId = staffIdReq;

    if (!content || !body.staffId || !body.customerId || !active) {
      throw new HttpException(
        'Vui lòng nhập đầy đủ thông tin',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdNotification = await this.chatService.createChat(body);
    return this.server.emit('emit-chat', createdNotification);
  }
}
