import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/errors";
import { verifyAccessToken } from "../utils/jwt";

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    next(new UnauthorizedError("Bearer token yuborilmagan"));
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch {
    next(new UnauthorizedError("Token noto'g'ri yoki muddati tugagan"));
  }
}
