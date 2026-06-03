import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";
import { asyncHandler } from "../../utils/async-handler";
import * as authController from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.schema";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), asyncHandler(authController.register));
authRouter.post("/login", validate(loginSchema), asyncHandler(authController.login));
authRouter.get("/me", authenticate, asyncHandler(authController.me));
