import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import * as commentController from "./comment.controller";
import {
  bulkCopySchema,
  commentParamsSchema,
  createCommentSchema,
  listCommentsSchema,
  statsCommentsSchema,
  updateCommentSchema,
} from "./comment.schema";

export const commentRouter = Router();

commentRouter.get("/", validate(listCommentsSchema), asyncHandler(commentController.list));
commentRouter.get("/stats", validate(statsCommentsSchema), asyncHandler(commentController.stats));
commentRouter.post("/bulk-copy", validate(bulkCopySchema), asyncHandler(commentController.bulkCopy));
commentRouter.get("/:id", validate(commentParamsSchema), asyncHandler(commentController.getById));
commentRouter.post(
  "/",
  authenticate,
  validate(createCommentSchema),
  asyncHandler(commentController.create),
);
commentRouter.patch(
  "/:id",
  authenticate,
  validate(updateCommentSchema),
  asyncHandler(commentController.update),
);
commentRouter.delete(
  "/:id",
  authenticate,
  validate(commentParamsSchema),
  asyncHandler(commentController.remove),
);
