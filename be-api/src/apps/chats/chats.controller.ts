import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get('customer')
  getChatsForCustomer(@Request() req: any) {
    const { customerId } = req.user;
    return this.chatsService.getChats(+customerId);
  }

  @Get('admin/customer/:id')
  getChatsForAdmin(@Param('id') id: string) {
    return this.chatsService.getChats(+id);
  }

  @Get('customer/info')
  getChatCustomerInfoForAdmin(@Request() req: any) {
    const { customerId } = req.user;

    return this.chatsService.getChatCustomerInfo(customerId);
  }

  @Patch('customer/status')
  updateStatusContactForCustomer(@Request() req: any) {
    const { customerId } = req.user;
    return this.chatsService.updateStatusChat(+customerId);
  }

  @Patch('customer/:id')
  updateStatusContact(@Param('id') id: string) {
    return this.chatsService.updateStatusChat(+id);
  }
}
