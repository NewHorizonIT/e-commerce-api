import { Response } from 'express';

class SuccessResponse {
  data: unknown;
  message?: string;
  statusCode: number;

  constructor(data: unknown, message?: string, statusCode: number = 200) {
    this.data = data;
    this.statusCode = statusCode;
    if (message) {
      this.message = message;
    }
  }

  send(res: Response) {
    res.status(this.statusCode).json({
      isSuccess: true,
      data: this.data,
      message: this.message,
    });
  }
}

export default SuccessResponse;
