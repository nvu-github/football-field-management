import { Injectable } from "@nestjs/common";
import { MailerService } from '@nestjs-modules/mailer';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';

import configuration from 'config/configuration';

@Injectable()
export class MailService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly refreshToken: string;
  private readonly address: string;

  constructor(private readonly mailerService: MailerService) {
    const { mail } = configuration();
    this.clientId = mail.clientId
    this.clientSecret = mail.clientSecret
    this.refreshToken = mail.refreshToken
    this.address = mail.address
  }

  private async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      this.clientId,
      this.clientSecret,
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token: this.refreshToken,
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.log(err)
          reject('Failed to create access token');
        }
        resolve(token);
      });
    });

    const config: Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.address,
        clientId: this.clientId,
        clientSecret: this.clientSecret,
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }

  async sendMail(mailParam: any) {
    const { to, from, subject, template, data } = mailParam
    await this.mailerService
      .sendMail({
        to,
        from,
        subject,
        template,
        context: data,
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}