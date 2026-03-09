// Class Error customized for HTTP responses
class HttpError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

// Not Found Error (404)
class NotFoundError extends HttpError {
  constructor(message: string = 'Resource not found') {
    super(404, message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

// Bad Request Error (400)
class BadRequestError extends HttpError {
  constructor(message: string = 'Bad request') {
    super(400, message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

// Unauthorized Error (401)
class UnauthorizedError extends HttpError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}
