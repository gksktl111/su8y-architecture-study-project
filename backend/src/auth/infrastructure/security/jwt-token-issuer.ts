import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {
    AccessTokenIssuerPort,
    AccessTokenPayload,
} from '../../application/ports/access-token-issuer.port';

@Injectable()
export class JwtTokenIssuer implements AccessTokenIssuerPort {
    constructor(private readonly jwtService: JwtService) {
    }

    issue(payload: AccessTokenPayload): string {
        return this.jwtService.sign(payload);
    }
}
