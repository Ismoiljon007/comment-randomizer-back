import type { Request, Response } from "express";
import { getValidatedQuery } from "../../middleware/validate.middleware";
import { sendPaginated, sendSuccess } from "../../utils/response";
import type { ListCategoriesInput } from "./category.service";
import * as categoryService from "./category.service";

export async function list(req: Request, res: Response): Promise<void> {
  const result = await categoryService.listCategories(getValidatedQuery<ListCategoriesInput>(req));
  sendPaginated(req, res, result.items, {
    page: result.page,
    totalPages: result.totalPages,
    total: result.total,
  });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const category = await categoryService.getCategory(req.params.id as string);
  sendSuccess(res, category);
}

export async function create(req: Request, res: Response): Promise<void> {
  const category = await categoryService.createCategory(req.body, {
    userId: req.user!.userId,
    role: req.user!.role,
  });
  sendSuccess(res, category, "", 201);
}

export async function update(req: Request, res: Response): Promise<void> {
  const category = await categoryService.updateCategory(req.params.id as string, req.body, {
    userId: req.user!.userId,
    role: req.user!.role,
  });
  sendSuccess(res, category);
}

export async function remove(req: Request, res: Response): Promise<void> {
  await categoryService.deleteCategory(req.params.id as string, {
    userId: req.user!.userId,
    role: req.user!.role,
  });
  res.status(204).send();
}
