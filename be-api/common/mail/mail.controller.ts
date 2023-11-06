import { Controller, Request, Response, Post, Get, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MailerService } from '@nestjs-modules/mailer';

import { MailService } from './mail.service';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) { }

  @Post('test')
  testMail() {
    return this.mailService.sendMail({ to: 'nguyenuc09112000@gmail.com', from: 'nguyenuc0911@gmail.com', subject: 'Demo', template: 'demo', data: { hello: 'Hello world' } })
  }
}