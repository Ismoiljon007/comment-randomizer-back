import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { AppError, ConflictError, NotFoundError } from "../utils/errors";

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFoundError(`Route topilmadi: ${req.method} ${req.originalUrl}`));
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const error = normalizeError(err);

  res.status(error.statusCode).json({
    message: error.message,
    ...(error.errors ? { errors: error.errors } : {}),
  });
}

function normalizeError(err: unknown): AppError {
  if (err instanceof AppError) return err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return new ConflictError("Bu qiymatga ega yozuv allaqachon mavjud");
    }

    if (err.code === "P2025") {
      return new NotFoundError();
    }
  }

  const message = err instanceof Error ? err.message : "Ichki server xatosi";
  return new AppError(message, 500);
}
