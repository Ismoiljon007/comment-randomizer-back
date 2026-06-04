import type { Request, Response } from "express";
import { getValidatedQuery } from "../../middleware/validate.middleware";
import { buildCommentsTemplate, parseCommentsFile } from "../../utils/excel";
import { ValidationError } from "../../utils/errors";
import { sendPaginated, sendSuccess } from "../../utils/response";
import type { ListCommentsInput, StatsCommentsInput } from "./comment.service";
import * as commentService from "./comment.service";

export async function list(req: Request, res: Response): Promise<void> {
  const result = await commentService.listComments(getValidatedQuery<ListCommentsInput>(req));
  sendPaginated(req, res, result.items, {
    page: result.page,
    totalPages: result.totalPages,
    total: result.total,
  });
}

export async function stats(req: Request, res: Response): Promise<void> {
  const result = await commentService.getCommentStats(getValidatedQuery<StatsCommentsInput>(req));
  sendSuccess(res, result);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const comment = await commentService.getComment(req.params.id as string);
  sendSuccess(res, comment);
}

export async function create(req: Request, res: Response): Promise<void> {
  const comment = await commentService.createComment(req.body, {
    userId: req.user!.userId,
    role: req.user!.role,
  });
  sendSuccess(res, comment, "", 201);
}

export async function update(req: Request, res: Response): Promise<void> {
  const comment = await commentService.updateComment(req.params.id as string, req.body, {
    userId: req.user!.userId,
    role: req.user!.role,
  });
  sendSuccess(res, comment);
}

export async function remove(req: Request, res: Response): Promise<void> {
  await commentService.deleteComment(req.params.id as string, {
    userId: req.user!.userId,
    role: req.user!.role,
  });
  res.status(204).send();
}

export async function uploadExcel(req: Request, res: Response): Promise<void> {
  const file = req.file;
  if (!file || !file.buffer || file.buffer.length === 0) {
    throw new ValidationError("No file uploaded (send it as form-data field 'file')");
  }

  let rows;
  try {
    rows = await parseCommentsFile(file.buffer, file.originalname, file.mimetype);
  } catch {
    throw new ValidationError(
      `Could not read the file. Make sure it is a valid .xlsx or .csv (received ${file.buffer.length} bytes). Legacy .xls is not supported — re-save as .xlsx.`,
    );
  }

  if (!rows.length) {
    throw new ValidationError("The file has no data rows (expected columns: category, text, sentiment)");
  }

  const result = await commentService.importComments(rows, {
    userId: req.user!.userId,
    role: req.user!.role,
  });

  sendSuccess(res, result, "", 201);
}

export async function downloadTemplate(_req: Request, res: Response): Promise<void> {
  const buffer = await buildCommentsTemplate();
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  res.setHeader("Content-Disposition", 'attachment; filename="comments-template.xlsx"');
  res.send(buffer);
}

export async function bulkCopy(req: Request, res: Response): Promise<void> {
  const result = await commentService.bulkCopy(req.body);
  sendSuccess(res, {
    count: result.count,
    text: result.text,
    total: result.total,
  });
}
