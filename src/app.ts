import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { errorMiddleware, notFound } from "./middleware/error.middleware";
import { apiRouter } from "./routes";

export const app = express();

function normalizeOrigin(origin: string): string {
  const trimmed = origin.trim().replace(/\/+$/, "");
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function parseOrigins(value: string): string[] {
  return value
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);
}

const allowedOrigins = new Set([
  ...parseOrigins(env.WEB_ORIGIN),
  ...parseOrigins(env.CORS_ORIGINS),
  ...(env.VERCEL_URL ? [normalizeOrigin(env.VERCEL_URL)] : []),
  ...(env.VERCEL_PROJECT_PRODUCTION_URL
    ? [normalizeOrigin(env.VERCEL_PROJECT_PRODUCTION_URL)]
    : []),
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  `http://localhost:${env.PORT}`,
  `http://127.0.0.1:${env.PORT}`,
]);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "base-uri": ["'self'"],
        "font-src": ["'self'", "https:", "data:"],
        "form-action": ["'self'"],
        "frame-ancestors": ["'self'"],
        "img-src": ["'self'", "data:"],
        "object-src": ["'none'"],
        "script-src": ["'self'", "'unsafe-inline'"],
        "script-src-attr": ["'none'"],
        "style-src": ["'self'", "https:", "'unsafe-inline'"],
      },
    },
  }),
);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS originiga ruxsat berilmagan: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);
app.use(notFound);
app.use(errorMiddleware);
