import {Inject, Injectable} from '@nestjs/common';
import {
    ACCESS_TOKEN_ISSUER,
} from '../ports/access-token-issuer.port';
import {PASSWORD_HASHER} from '../ports/password-hasher.port';
import {USER_REPOSITORY} from '../../domain/repositories/user.repository';
import type {AccessTokenIssuerPort} from '../ports/access-token-issuer.port';
import type {PasswordHasherPort} from '../ports/password-hasher.port';
import type {UserRepository} from '../../domain/repositories/user.repository';
import {InvalidCredentialsError} from '../errors/invalid-credentials.error';

export interface SignInCommand {
    username: string;
    password: string;
}

export interface SignInResult {
    accessToken: string;
}

@Injectable()
export class SignInUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        @Inject(PASSWORD_HASHER)
        private readonly passwordHasher: PasswordHasherPort,
        @Inject(ACCESS_TOKEN_ISSUER)
        private readonly accessTokenIssuer: AccessTokenIssuerPort,
    ) {
    }

    async execute(command: SignInCommand): Promise<SignInResult> {
        const {username, password} = command;
        const user = await this.userRepository.findByUsername(username);

        if (!user) {
            throw new InvalidCredentialsError();
        }

        const isPasswordMatched = await this.passwordHasher.compare(
            password,
            user.password,
        );

        if (!isPasswordMatched) {
            throw new InvalidCredentialsError();
        }

        return {
            accessToken: this.accessTokenIssuer.issue({username: user.username}),
        };
    }
}
