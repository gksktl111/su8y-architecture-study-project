import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApplicationError } from '../../application/errors/application.error';

@Catch()
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    // 애플리케이션 예외는 status/code를 포함하므로 공통 규격으로 바로 응답할 수 있다.
    if (exception instanceof ApplicationError) {
      response.status(exception.status).json({
        statusCode: exception.status,
        code: exception.code,
        message: exception.message,
        success: false,
      });
      return;
    }

    // ValidationPipe 같은 Nest 기본 예외도 같은 응답 형태로 맞춘다.
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse;

      response.status(status).json({
        statusCode: status,
        message,
        success: false,
      });
      return;
    }

    // 예상 못 한 런타임 에러는 500으로 내려보낸다.
    if (exception instanceof Error) {
      response.status(500).json({
        statusCode: 500,
        message: exception.message,
        success: false,
      });
      return;
    }

    response.status(500).json({
      statusCode: 500,
      message: 'Unexpected error occurred',
      success: false,
    });
  }
}
