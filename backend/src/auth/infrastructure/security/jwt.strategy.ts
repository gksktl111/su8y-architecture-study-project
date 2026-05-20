import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import type { UserRepository } from '../../domain/repositories/user.repository';

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
      // Bearer 토큰을 읽고 서명/만료를 검증하는 방식은 Passport JWT 전략에 위임한다.
      secretOrKey: process.env.JWT_SECRET ?? 'testrppgfaicalexpressionanalysis',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<{ id?: number; username: string }> {
    // 토큰이 유효하더라도 실제 사용자가 없으면 인증 실패로 처리한다.
    const user = await this.userRepository.findByUsername(payload.username);

    if (!user) {
      throw new UnauthorizedException('Please check your login credentials');
    }

    // 이후 request.user에는 인증에 필요한 최소 정보만 남긴다.
    return {
      id: user.id,
      username: user.username,
    };
  }
}
