import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { InvalidCredentialsError } from '../../application/errors/invalid-credentials.error';
import { UserAlreadyExistsError } from '../../application/errors/user-already-exists.error';

@Catch(UserAlreadyExistsError, InvalidCredentialsError)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(
    exception: UserAlreadyExistsError | InvalidCredentialsError,
    host: ArgumentsHost,
  ) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof UserAlreadyExistsError) {
      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: exception.message,
        error: 'Conflict',
      });
      return;
    }

    if (exception instanceof InvalidCredentialsError) {
      response.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Please check your login credentials',
        error: 'Unauthorized',
      });
      return;
    }
  }
}
