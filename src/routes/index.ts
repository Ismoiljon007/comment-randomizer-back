import { Router } from "express";
import { authRouter } from "../modules/auth/auth.routes";
import { categoryRouter } from "../modules/categories/category.routes";
import { commentRouter } from "../modules/comments/comment.routes";
import { sendSuccess } from "../utils/response";
import { docsRouter } from "./docs.routes";

export const apiRouter = Router();

apiRouter.use(docsRouter);

apiRouter.get("/health", (_req, res) => {
  sendSuccess(res, { ok: true });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/comments", commentRouter);
