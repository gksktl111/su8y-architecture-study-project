import {Column, Entity, PrimaryGeneratedColumn, Unique} from 'typeorm';

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
