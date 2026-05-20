import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { UserAlreadyExistsError } from '../errors/user-already-exists.error';

export interface CheckUsernameCommand {
  username: string;
}

export interface CheckUsernameResult {
  available: boolean;
}

@Injectable()
export class CheckUsernameUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CheckUsernameCommand): Promise<CheckUsernameResult> {
    const user = await this.userRepository.findByUsername(command.username);

    if (user) {
      throw new UserAlreadyExistsError('Already exists username');
    }

    return { available: true };
  }
}
