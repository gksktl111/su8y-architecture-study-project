import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../../../../../auth/domain/repositories/user.repository';
import { User } from '../../../../../auth/domain/entities/user';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class TypeormUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}

  async save(user: User): Promise<User> {
    // Domain 모델을 ORM 엔티티로 바꿔 저장한 뒤 다시 domain 모델로 복원한다.
    const savedUser = await this.userRepository.save(
      UserMapper.toOrmEntity(user),
    );
    return UserMapper.toDomain(savedUser);
  }

  async findByUsername(username: string): Promise<User | null> {
    // TypeORM 결과를 그대로 밖으로 내보내지 않고 domain 모델로 변환한다.
    const user = await this.userRepository.findOneBy({ username });
    return user ? UserMapper.toDomain(user) : null;
  }
}
