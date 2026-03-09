import { Response } from 'express';

// Success class to standardize successful responses
class Success<T> {
  public statusCode: number;
  public data: T;
  public message: string;

  constructor(statusCode: number, data: T, message: string) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    Object.setPrototypeOf(this, Success.prototype);
  }

  send(res: Response) {
    return res.status(this.statusCode).json({
      statusCode: this.statusCode,
      data: this.data,
      message: this.message,
    });
  }
}

export { Success };
