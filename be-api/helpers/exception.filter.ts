import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException | unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string[] = ['Internal server error!'];

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse() || exception.message;
      console.log(exception.getResponse())
      if (exceptionResponse && exceptionResponse['message']) {
        message = exceptionResponse['message'];
      } else {
        message = [exceptionResponse && exceptionResponse.toString() || 'Internal server error!'];
      }
    } else {
      console.log(exception)
    }

    if (exception && exception['code'] && exception['code'] == 'ENOENT') {
      httpStatus = 404;
      message = ['Not found!'];
    }

    const responseBody = {
      statusCode: httpStatus,
      messages: message,
      success: false,
      data: null,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
