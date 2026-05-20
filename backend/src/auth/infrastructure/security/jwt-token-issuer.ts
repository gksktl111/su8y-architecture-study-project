import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AccessTokenIssuerPort,
  AccessTokenPayload,
} from '../../application/ports/access-token-issuer.port';

@Injectable()
export class JwtTokenIssuer implements AccessTokenIssuerPort {
  constructor(private readonly jwtService: JwtService) {}

  issue(payload: AccessTokenPayload): string {
    // 토큰 발급 방식은 infrastructure가 숨기고, application에는 문자열 결과만 넘긴다.
    return this.jwtService.sign(payload);
  }
}
