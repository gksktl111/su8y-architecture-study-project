import {ConflictException, Inject, Injectable} from '@nestjs/common';
import {USER_REPOSITORY} from '../../domain/repositories/user.repository';
import type {UserRepository} from '../../domain/repositories/user.repository';

export interface CheckUsernameCommand {
    username: string;
}

export interface CheckUsernameResult {
    message: string;
}

@Injectable()
export class CheckUsernameUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
    ) {
    }

    async execute(command: CheckUsernameCommand): Promise<CheckUsernameResult> {
        const user = await this.userRepository.findByUsername(command.username);

        if (user) {
            throw new ConflictException('Already exists username');
        }

        return {message: 'Successfully check username'};
    }
}
