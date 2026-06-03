import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { ValidationError } from "../utils/errors";

const requestContainers = new Set(["body", "query", "params"]);

function formatField(path: PropertyKey[]): string {
  const parts = path.map(String).filter((part) => !requestContainers.has(part));
  return parts.join(".") || path.map(String).join(".") || "request";
}

export function validate(schema: z.ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      next(
        new ValidationError(
          "Validation failed",
          result.error.issues.map((issue) => ({
            field: formatField(issue.path),
            message: issue.message,
          })),
        ),
      );
      return;
    }

    const parsed = result.data as {
      body?: unknown;
      query?: unknown;
      params?: unknown;
    };

    if (parsed.body !== undefined) req.body = parsed.body;
    if (parsed.query !== undefined) req.query = parsed.query as Request["query"];
    if (parsed.params !== undefined) req.params = parsed.params as Request["params"];

    next();
  };
}
