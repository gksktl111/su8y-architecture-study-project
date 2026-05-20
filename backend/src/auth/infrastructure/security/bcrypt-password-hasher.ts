import {Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {PasswordHasherPort} from '../../application/ports/password-hasher.port';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasherPort {
    async hash(plainText: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(plainText, salt);
    }

    async compare(plainText: string, hashedText: string): Promise<boolean> {
        return bcrypt.compare(plainText, hashedText);
    }
}
