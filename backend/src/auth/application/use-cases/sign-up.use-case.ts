import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { PASSWORD_HASHER } from '../ports/password-hasher.port';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user';
import type { PasswordHasherPort } from '../ports/password-hasher.port';
import type { UserRepository } from '../../domain/repositories/user.repository';

export interface SignUpCommand {
  username: string;
  password: string;
}

export interface SignUpResult {
  id: number;
  username: string;
}

@Injectable()
export class SignUpUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(command: SignUpCommand): Promise<SignUpResult> {
    const { username, password } = command;
    const existingUser = await this.userRepository.findByUsername(username);

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await this.passwordHasher.hash(password);
    const savedUser = await this.userRepository.save(
      User.create(username, hashedPassword),
    );

    return {
      id: savedUser.id as number,
      username: savedUser.username,
    };
  }
}
