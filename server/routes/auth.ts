// 用途: 认证路由 — 注册、登录、获取当前用户
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";
import { requireAuth, JWT_SECRET } from "../middleware/auth.js";

const router = Router();

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, error: { code: "INVALID_INPUT", message: "用户名和密码不能为空" } });
  }
  if (username.length < 3 || username.length > 32) {
    return res.status(400).json({ success: false, error: { code: "INVALID_INPUT", message: "用户名长度 3~32 个字符" } });
  }

  const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
  if (existing) {
    return res.status(409).json({ success: false, error: { code: "USER_EXISTS", message: "用户名已存在" } });
  }

  const password_hash = bcrypt.hashSync(password, 10);
  const result = db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)").run(username, password_hash);

  return res.json({ success: true, data: { id: result.lastInsertRowid as number, username } });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, error: { code: "INVALID_INPUT", message: "用户名和密码不能为空" } });
  }

  const user = db.prepare("SELECT id, username, password_hash FROM users WHERE username = ?").get(username) as
    { id: number; username: string; password_hash: string } | undefined;
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ success: false, error: { code: "INVALID_CREDENTIALS", message: "用户名或密码错误" } });
  }

  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });
  return res.json({ success: true, data: { token, user: { id: user.id, username: user.username } } });
});

// GET /api/auth/me
router.get("/me", requireAuth, (req, res) => {
  return res.json({ success: true, data: req.user });
});

export default router;
