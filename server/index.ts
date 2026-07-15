import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import authRoutes from "./routes/auth.js";
// import fsRoutes from "./routes/files.js";  // 阶段 2c

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

// API 路由
app.use("/api/auth", authRoutes);
// app.use("/api/fs", requireAuth, fsRoutes);  // 2c

// 生产：serve 前端构建产物
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "../dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});