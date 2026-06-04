import type { Request, Response } from "express";

export interface PaginationMeta {
  page: number;
  totalPages: number;
  total: number;
}

function buildPageUrl(req: Request, page: number): string {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const proto =
    (typeof forwardedProto === "string" ? forwardedProto.split(",")[0] : undefined) || req.protocol;
  const host = req.get("host") ?? "localhost";
  const url = new URL(`${proto}://${host}${req.originalUrl}`);
  url.searchParams.set("page", String(page));
  return url.toString();
}

export function sendSuccess(
  res: Response,
  data: unknown,
  message = "",
  statusCode = 200,
): void {
  res.status(statusCode).json({
    status: "success",
    data,
    message,
  });
}

export function sendPaginated(
  req: Request,
  res: Response,
  items: unknown[],
  meta: PaginationMeta,
  message = "",
): void {
  res.json({
    status: "success",
    data: items,
    message,
    pagination: {
      next: meta.page < meta.totalPages ? buildPageUrl(req, meta.page + 1) : null,
      previous: meta.page > 1 ? buildPageUrl(req, meta.page - 1) : null,
      current_page: meta.page,
      total_pages: meta.totalPages,
      total_items: meta.total,
    },
  });
}
