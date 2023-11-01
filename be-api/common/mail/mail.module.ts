import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { MailController } from './mail.controller';
import { MailService } from './mail.service';


@Module({
  imports: [
    // MailerModule.forRoot({
    //   transport: { host: 'smtp.gmail.com', port: 587, secure: false },
    //   template: {
    //     dir: process.cwd() + '/config/mail/templates/',
    //     adapter: new HandlebarsAdapter(),
    //     options: {
    //       strict: true,
    //     },
    //   },
    // }),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule { }
