import { Controller, Request, Response, Post, Get, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as moment from 'moment';
import * as queryString from 'qs';
import * as crypto from 'crypto';
import { sortObject } from 'utils/app';

import configuration from 'config/configuration';

import { PayloadCreatePaymentDto } from './dtos';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  private readonly vnpayUrl: string;
  private readonly tmnCodeVnPay: string;
  private readonly secretKeyVnPay: string;
  private readonly returnUrlVnPay: string;

  constructor() {
    const { payment } = configuration()
    this.vnpayUrl = payment.vnpayUrl
    this.tmnCodeVnPay = payment.tmnCodeVnPay
    this.secretKeyVnPay = payment.secretKeyVnPay
    this.returnUrlVnPay = payment.returnUrlVnPay
  }

  @Post('create-payment-url')
  createPaymentUrl(
    @Body() body: PayloadCreatePaymentDto,
    @Request() req: any,
  ) {
    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const date = new Date();
    const tmnCode = this.tmnCodeVnPay;
    const secretKey = this.secretKeyVnPay;
    let vnpUrl = this.vnpayUrl;
    const returnUrl =
      `${this.returnUrlVnPay}football-pitches/thanks`;
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const orderId = moment(date).format('DDHHmmss');
    const amount = body.amount;
    // const bankCode = "VNBANK";
    const locale = 'vn';
    const currCode = 'VND';

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    // if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = 'VNBANK';
    // }

    vnp_Params = sortObject(vnp_Params);

    const signData = queryString.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + queryString.stringify(vnp_Params, { encode: false });
    return { paymentRedirect: vnpUrl };
  }

  @Get('vnpay-return')
  getVnPayReturn(@Request() req: any, @Response() res: any) {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let secretKey = this.secretKeyVnPay;

    let signData = queryString.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

      return { code: vnp_Params['vnp_ResponseCode'] }
    } else {
      return { code: '97' }
    }
  }

  @Get('vnpay-ipn')
  getVNPayIpn(@Request() req: any, @Response() res: any) {
    console.log('co chay vao day')
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let secretKey = this.secretKeyVnPay;
    let signData = queryString.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      let orderId = vnp_Params['vnp_TxnRef'];
      let rspCode = vnp_Params['vnp_ResponseCode'];
      //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
      return 'success'
    } else {
      return 'fail'
    }
  }
}
