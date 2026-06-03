import type { Request, Response } from "express";
import * as authService from "./auth.service";

export async function register(req: Request, res: Response): Promise<void> {
  const result = await authService.register(req.body);
  res.status(201).json(result);
}

export async function login(req: Request, res: Response): Promise<void> {
  const result = await authService.login(req.body);
  res.json(result);
}

export async function me(req: Request, res: Response): Promise<void> {
  const user = await authService.getCurrentUser(req.user!.userId);
  res.json({ user });
}
