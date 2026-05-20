import {User} from '../entities/user';

export interface UserRepository {
    save(user: User): Promise<User>;

    findByUsername(username: string): Promise<User | null>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
