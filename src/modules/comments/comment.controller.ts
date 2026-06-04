import type { Request, Response } from "express";
import { getValidatedQuery } from "../../middleware/validate.middleware";
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

export async function bulkCopy(req: Request, res: Response): Promise<void> {
  const result = await commentService.bulkCopy(req.body);
  sendSuccess(res, {
    count: result.count,
    text: result.text,
    total: result.total,
  });
}
