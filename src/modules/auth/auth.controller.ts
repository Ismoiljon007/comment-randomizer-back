import type { Request, Response } from "express";
import { sendSuccess } from "../../utils/response";
import * as authService from "./auth.service";

export async function register(req: Request, res: Response): Promise<void> {
  const result = await authService.register(req.body);
  sendSuccess(res, result, "", 201);
}

export async function login(req: Request, res: Response): Promise<void> {
  const result = await authService.login(req.body);
  sendSuccess(res, result);
}

export async function me(req: Request, res: Response): Promise<void> {
  const user = await authService.getCurrentUser(req.user!.userId);
  sendSuccess(res, user);
}
