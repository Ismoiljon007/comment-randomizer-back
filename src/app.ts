import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorMiddleware, notFound } from "./middleware/error.middleware";
import { apiRouter } from "./routes";

export const app = express();

const allowedOrigins = new Set([
  "https://comment-randomizer-back.vercel.app",
]);

function isAllowedOrigin(origin: string): boolean {
  if (allowedOrigins.has(origin)) return true;

  try {
    const url = new URL(origin);
    const isLocalhost = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    return isLocalhost && (url.protocol === "http:" || url.protocol === "https:");
  } catch {
    return false;
  }
}

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
      if (!origin || isAllowedOrigin(origin)) {
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
