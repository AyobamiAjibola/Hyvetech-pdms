export default class CustomAPIError extends Error {
  private readonly _code: number;

  constructor(message: string, code: number) {
    super(message);
    this._code = code;
  }

  public static response(message: string, code: number) {
    return new CustomAPIError(message, code);
  }

  get code(): number {
    return this._code;
  }
}
