import { Controller, Request, Response, Post, Get, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { format } from 'date-fns';
import * as queryString from 'qs';
import * as crypto from 'crypto';
import { sortObject } from 'utils/app';

import { PayloadCreatePaymentDto } from './dtos';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  @Post('create-payment-url')
  createPaymentUrl(
    @Body() body: PayloadCreatePaymentDto,
    @Request() req: any,
    @Response() res: any,
  ) {
    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const tmnCode = '0NRQ35SG';
    const secretKey = 'LUJPSBNCKJKWIHPYCFNPQIGYCNEYWMYI';
    let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const returnUrl =
      'https://sandbox.vnpayment.vn/merchant_webapi/merchant.html';

    const date = new Date();

    const createDate = format(date, 'yyyymmddHHmmss');
    const orderId = format(date, 'HHmmss');
    const amount = body.amount;
    const bankCode = body.bankCode;
    const locale = 'vn';
    const currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    const signData = queryString.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + queryString.stringify(vnp_Params, { encode: false });
    console.log(vnpUrl);
    res.redirect(vnpUrl);
  }

  @Get('vnpay-ipn')
  getVNPayIpn(@Request() req: any, @Response() res: any) {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let secretKey = 'LUJPSBNCKJKWIHPYCFNPQIGYCNEYWMYI';
    let signData = queryString.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      let orderId = vnp_Params['vnp_TxnRef'];
      let rspCode = vnp_Params['vnp_ResponseCode'];
      //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
      res.status(200).json({ RspCode: '00', Message: 'success' });
    } else {
      res.status(200).json({ RspCode: '97', Message: 'Fail checksum' });
    }
  }

  @Get('vnpay-return')
  getVnPayReturn(@Request() req: any, @Response() res: any) {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // vnp_Params = sortObject(vnp_Params);

    let tmnCode = '0NRQ35SG';
    let secretKey = 'LUJPSBNCKJKWIHPYCFNPQIGYCNEYWMYI';

    let signData = queryString.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

      res.render('success', { code: vnp_Params['vnp_ResponseCode'] });
    } else {
      res.render('success', { code: '97' });
    }
  }
}
