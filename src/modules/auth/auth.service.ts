import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";
import { ConflictError, UnauthorizedError } from "../../utils/errors";
import { signAccessToken } from "../../utils/jwt";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const;

function createAuthResponse(user: { id: string; email: string; role: "USER" | "ADMIN"; name: string }) {
  return {
    user,
    token: signAccessToken(user),
  };
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existing) {
    throw new ConflictError("Email is already registered");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
    select: userSelect,
  });

  return createAuthResponse(user);
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const passwordIsValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordIsValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  return createAuthResponse({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });

  if (!user) {
    throw new UnauthorizedError("User no longer exists");
  }

  return user;
}
