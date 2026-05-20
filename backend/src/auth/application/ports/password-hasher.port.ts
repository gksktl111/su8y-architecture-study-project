export interface PasswordHasherPort {
    hash(plainText: string): Promise<string>;

    compare(plainText: string, hashedText: string): Promise<boolean>;
}

export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');
