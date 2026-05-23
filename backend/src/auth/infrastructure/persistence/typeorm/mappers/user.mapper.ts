import { User } from '../../../../../auth/domain/entities/user';
import { UserOrmEntity } from '../entities/user.orm-entity';

export class UserMapper {
  static toDomain(entity: UserOrmEntity): User {
    // 영속성 전용 엔티티를 순수 domain 모델로 변환한다.
    return User.create(entity.username, entity.password, entity.id);
  }

  static toOrmEntity(user: User): UserOrmEntity {
    // Domain 모델을 DB 저장이 가능한 TypeORM 엔티티로 변환한다.
    const entity = new UserOrmEntity();
    if (user.id) {
      entity.id = user.id;
    }
    entity.username = user.username;
    entity.password = user.hashedPassword;
    return entity;
  }
}
