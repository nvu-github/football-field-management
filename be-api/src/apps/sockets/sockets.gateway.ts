import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Request, UseGuards } from '@nestjs/common';

import { SocketsService } from './sockets.service';
import { ContactService } from './contact.service';
import { NotificationService } from './notification.service';
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
    private readonly notificationService: NotificationService,
    private readonly contactService: ContactService,
  ) { }

  handleConnection(client) {
    console.log(`New WebSocket connection established with ID: ${client.id}`);
  }

  @WebSocketServer() server;

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('notifications')
  async create(@MessageBody() body: PayloadNotificationDto, @Request() req: any,) {
    const { customerId } = req.user;
    await this.notificationService.createNotification({...body, customerId, staffId: 1})
    return this.server.emit('emit-notification', 201);
  }

  @SubscribeMessage('findAllSockets')
  findAll() {
    return this.socketsService.findAll();
  }

  @SubscribeMessage('findOneSocket')
  findOne(@MessageBody() id: number) {
    return this.socketsService.findOne(id);
  }

  @SubscribeMessage('updateSocket')
  update(@MessageBody() updateSocketDto: any) {
    return this.socketsService.update(updateSocketDto.id, updateSocketDto);
  }

  @SubscribeMessage('removeSocket')
  remove(@MessageBody() id: number) {
    return this.socketsService.remove(id);
  }
}
