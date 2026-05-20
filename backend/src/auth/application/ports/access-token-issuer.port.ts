export interface AccessTokenPayload {
    username: string;
}

export interface AccessTokenIssuerPort {
    issue(payload: AccessTokenPayload): string;
}

export const ACCESS_TOKEN_ISSUER = Symbol('ACCESS_TOKEN_ISSUER');
