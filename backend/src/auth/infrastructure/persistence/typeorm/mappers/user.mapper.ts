import {User} from '../../../../../auth/domain/entities/user';
import {UserOrmEntity} from '../entities/user.orm-entity';

export class UserMapper {
    static toDomain(entity: UserOrmEntity): User {
        return User.create(entity.username, entity.password, entity.id);
    }

    static toOrmEntity(user: User): UserOrmEntity {
        const entity = new UserOrmEntity();
        if (user.id) {
            entity.id = user.id;
        }
        entity.username = user.username;
        entity.password = user.password;
        return entity;
    }
}
