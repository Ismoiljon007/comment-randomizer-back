export interface ValidationIssue {
  field: string;
  message: string;
}

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public errors?: ValidationIssue[],
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validatsiyadan o'tmadi", errors?: ValidationIssue[]) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Autentifikatsiyadan o'tilmagan") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Ruxsat yo'q") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resurs topilmadi") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resurs allaqachon mavjud") {
    super(message, 409);
  }
}
