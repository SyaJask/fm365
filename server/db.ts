import Database from "better-sqlite3";
import path from "node:path";

const DB_PATH = path.resolve("server/data.db");
const db = new Database(DB_PATH);

// 启用 WAL 模式提高并发读性能
db.pragma("journal_mode = WAL");

// 建表
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export default db;