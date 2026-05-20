export class InvalidCredentialsError extends Error {
  readonly code = 'AUTH_INVALID_CREDENTIALS';

  constructor(message = 'Invalid credentials') {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}
