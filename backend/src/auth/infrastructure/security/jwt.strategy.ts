import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {USER_REPOSITORY} from '../../domain/repositories/user.repository';
import type {UserRepository} from '../../domain/repositories/user.repository';

export interface JwtPayload {
    username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
    ) {
        super({
            secretOrKey: process.env.JWT_SECRET ?? 'testrppgfaicalexpressionanalysis',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
        });
    }

    async validate(payload: JwtPayload): Promise<{ id?: number; username: string }> {
        const user = await this.userRepository.findByUsername(payload.username);

        if (!user) {
            throw new UnauthorizedException('Please check your login credentials');
        }

        return {
            id: user.id,
            username: user.username,
        };
    }
}
