import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "fm365-dev-secret";

export interface AuthUser { userId: number; username: string; }

// 扩展 Express Request 类型
declare global {
  namespace Express { interface Request { user?: AuthUser } }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "未登录" } });
  }
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET) as AuthUser;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, error: { code: "TOKEN_EXPIRED", message: "登录已过期" } });
  }
}

export { JWT_SECRET };