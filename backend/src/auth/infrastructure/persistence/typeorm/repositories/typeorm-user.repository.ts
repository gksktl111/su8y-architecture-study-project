import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {UserRepository} from '../../../../../auth/domain/repositories/user.repository';
import {User} from '../../../../../auth/domain/entities/user';
import {UserOrmEntity} from '../entities/user.orm-entity';
import {UserMapper} from '../mappers/user.mapper';

@Injectable()
export class TypeormUserRepository implements UserRepository {
    constructor(
        @InjectRepository(UserOrmEntity)
        private readonly userRepository: Repository<UserOrmEntity>,
    ) {
    }

    async save(user: User): Promise<User> {
        const savedUser = await this.userRepository.save(UserMapper.toOrmEntity(user));
        return UserMapper.toDomain(savedUser);
    }

    async findByUsername(username: string): Promise<User | null> {
        const user = await this.userRepository.findOneBy({username});
        return user ? UserMapper.toDomain(user) : null;
    }
}
