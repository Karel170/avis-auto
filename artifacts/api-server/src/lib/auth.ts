import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  next();
}

export async function requireCompanyAccess(req: Request, res: Response, next: NextFunction) {
  next();
}
