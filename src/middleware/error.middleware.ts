import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { AppError, ConflictError, NotFoundError, ValidationError } from "../utils/errors";

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const error = normalizeError(err);

  res.status(error.statusCode).json({
    status: "error",
    data: null,
    message: error.message,
    ...(error.errors ? { errors: error.errors } : {}),
  });
}

function normalizeError(err: unknown): AppError {
  if (err instanceof AppError) return err;

  // Multer raises MulterError (e.g. file too large) for upload failures.
  if (err instanceof Error && err.name === "MulterError") {
    return new ValidationError(`File upload failed: ${err.message}`);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return new ConflictError("A record with this value already exists");
    }

    if (err.code === "P2025") {
      return new NotFoundError();
    }
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  return new AppError(message, 500);
}
