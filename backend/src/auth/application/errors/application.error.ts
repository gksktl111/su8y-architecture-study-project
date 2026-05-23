export abstract class ApplicationError extends Error {
  // 유스케이스에서 공통 형태로 던지고, HTTP 계층은 이 계약만 보고 응답을 만든다.
  protected constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = new.target.name;
  }
}
