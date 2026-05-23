import { HttpStatus } from '@nestjs/common';
import { ApplicationError } from './application.error';

export class InvalidCredentialsError extends ApplicationError {
  // 어떤 입력값이 틀렸는지는 숨기고 인증 실패만 표현한다.
  constructor(message = 'Invalid credentials') {
    super(message, 'AUTH_INVALID_CREDENTIALS', HttpStatus.UNAUTHORIZED);
  }
}
