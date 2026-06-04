import compression from "compression";
import cors, { type CorsOptions } from "cors";
import express from "express";
import helmet from "helmet";
import { errorMiddleware, notFound } from "./middleware/error.middleware";
import { apiRouter } from "./routes";

export const app = express();

const corsOptions: CorsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

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
  cors(corsOptions),
);
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);
app.use(notFound);
app.use(errorMiddleware);
