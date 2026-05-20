import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordHasherPort } from '../../application/ports/password-hasher.port';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasherPort {
  async hash(plainText: string): Promise<string> {
    // 해시마다 salt를 새로 생성해 동일 비밀번호의 결과가 고정되지 않게 한다.
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(plainText, salt);
  }

  async compare(plainText: string, hashedText: string): Promise<boolean> {
    // bcrypt가 내부적으로 salt를 사용해 원문과 저장된 해시를 비교한다.
    return bcrypt.compare(plainText, hashedText);
  }
}
