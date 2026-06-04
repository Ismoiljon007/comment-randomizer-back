import type { Request, Response } from "express";
import * as commentService from "./comment.service";

export async function list(req: Request, res: Response): Promise<void> {
  const result = await commentService.listComments(req.query as never);
  res.json(result);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const comment = await commentService.getComment(req.params.id as string);
  res.json({ comment });
}

export async function create(req: Request, res: Response): Promise<void> {
  const comment = await commentService.createComment(req.body, {
    userId: req.user!.userId,
    role: req.user!.role,
  });
  res.status(201).json({ comment });
}

export async function update(req: Request, res: Response): Promise<void> {
  const comment = await commentService.updateComment(req.params.id as string, req.body, {
    userId: req.user!.userId,
    role: req.user!.role,
  });
  res.json({ comment });
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
  res.json(result);
}
