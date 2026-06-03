import type { Role } from "@prisma/client";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface AccessTokenPayload extends JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

export interface TokenUser {
  id: string;
  email: string;
  role: Role;
}

export function signAccessToken(user: TokenUser): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    env.JWT_ACCESS_SECRET,
    options,
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}
