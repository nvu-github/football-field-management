import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@app/auth/jwt-auth.guard';

@ApiTags('Chat')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get('customer')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getChatsForCustomer(@Request() req: any) {
    const { customerId } = req.user;
    return this.chatsService.getChats(+customerId);
  }

  @Get('admin/customer/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getChatsForAdmin(@Param('id') id: string) {
    return this.chatsService.getChats(+id);
  }

  @Get('customer/info')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getChatCustomerInfoForAdmin() {
    return this.chatsService.getChatCustomerInfoForAdmin();
  }
}
