export class HttpException extends Error {
  constructor(public readonly statusCode: number, message?: string, public readonly code?: string) {
    super(message);
    Error.captureStackTrace(this, HttpException);
  }
}
