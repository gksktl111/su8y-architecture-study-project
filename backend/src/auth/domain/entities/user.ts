export class User {
  constructor(
    public readonly username: string,
    public readonly hashedPassword: string,
    public readonly id?: number,
  ) {}

  static create(username: string, hashedPassword: string, id?: number): User {
    return new User(username, hashedPassword, id);
  }
}
