export class User {
  constructor(
    public readonly username: string,
    public readonly password: string,
    public readonly id?: number,
  ) {}

  static create(username: string, password: string, id?: number): User {
    return new User(username, password, id);
  }
}
