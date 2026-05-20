export class UserAlreadyExistsError extends Error {
  readonly code = 'AUTH_USER_ALREADY_EXISTS';

  constructor(message = 'User already exists') {
    super(message);
    this.name = 'UserAlreadyExistsError';
  }
}
