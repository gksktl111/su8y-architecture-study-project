import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

// TypeORM이 users 테이블과 매핑할 영속성 전용 모델이다.
@Entity('users')
@Unique(['username'])
export class UserOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column()
  password!: string;
}
