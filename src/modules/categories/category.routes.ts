import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import * as categoryController from "./category.controller";
import {
  categoryParamsSchema,
  createCategorySchema,
  listCategoriesSchema,
  updateCategorySchema,
} from "./category.schema";

export const categoryRouter = Router();

categoryRouter.get("/", validate(listCategoriesSchema), asyncHandler(categoryController.list));
categoryRouter.get("/:id", validate(categoryParamsSchema), asyncHandler(categoryController.getById));
categoryRouter.post(
  "/",
  authenticate,
  validate(createCategorySchema),
  asyncHandler(categoryController.create),
);
categoryRouter.patch(
  "/:id",
  authenticate,
  validate(updateCategorySchema),
  asyncHandler(categoryController.update),
);
categoryRouter.delete(
  "/:id",
  authenticate,
  validate(categoryParamsSchema),
  asyncHandler(categoryController.remove),
);
