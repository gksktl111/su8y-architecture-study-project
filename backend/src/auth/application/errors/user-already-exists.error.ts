import { HttpStatus } from '@nestjs/common';
import { ApplicationError } from './application.error';

export class UserAlreadyExistsError extends ApplicationError {
  // 이미 사용 중인 username이면 회원가입을 진행할 수 없다.
  constructor(message = 'User already exists') {
    super(message, 'AUTH_USER_ALREADY_EXISTS', HttpStatus.CONFLICT);
  }
}
