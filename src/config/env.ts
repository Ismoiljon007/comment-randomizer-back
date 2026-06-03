import dotenv from "dotenv";

dotenv.config();

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  DATABASE_URL: getRequiredEnv("DATABASE_URL"),
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  PORT: Number(process.env.PORT || 4000),
  NODE_ENV: process.env.NODE_ENV || "development",
  WEB_ORIGIN: process.env.WEB_ORIGIN || "http://localhost:3000",
  COMMENTS_JSON_PATH: process.env.COMMENTS_JSON_PATH || "",
};

export function getJwtAccessSecret(): string {
  return getRequiredEnv("JWT_ACCESS_SECRET");
}
