# API Conventions

本项目当前使用静态 mock 数据，尚未接入真实后端。本文档定义后续接入文件系统 API 时的接口约定，确保 store 层与网络层解耦。

## 设计原则

- **Store 层不感知数据源** — `fileStore` 通过抽象接口操作文件树，具体数据来自 mock 还是 HTTP 由注入层决定
- **统一错误格式** — 所有 API 响应遵循相同结构，store 层统一处理
- **乐观更新 + 回滚** — 先更新 UI 状态，失败时回滚到上一个快照

## 统一响应格式

```ts
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;       // 错误码，如 "FILE_NOT_FOUND"
    message: string;    // 人类可读描述
    details?: unknown;  // 可选的附加信息
  };
}
```

## 核心接口约定（规划中）

### 文件/目录操作

| 方法 | 路径 | 说明 |
|---|---|---|
| `GET` | `/api/fs/list?path=` | 列出目录内容，返回 `FileNode[]` |
| `POST` | `/api/fs/create` | 创建文件或文件夹，body `{ path, name, type }` |
| `PUT` | `/api/fs/rename` | 重命名，body `{ oldPath, newPath }` |
| `DELETE` | `/api/fs/delete` | 删除，body `{ paths: string[] }` |
| `POST` | `/api/fs/copy` | 复制，body `{ sourcePaths, targetDir }` |
| `POST` | `/api/fs/move` | 剪切，body `{ sourcePaths, targetDir }` |
| `GET` | `/api/fs/search?q=` | 搜索文件，query 参数 |

### 文件节点结构

```ts
interface FileNode {
  name: string;
  type: "folder" | "file";
  ext?: string;
  size?: number;
  modifiedAt?: string;  // ISO 8601
  children?: FileNode[];
}
```

## Store → API 迁移指南

当前 `fileStore` 的方法签名已预留扩展点，迁移时只需替换内部实现：

| 当前方法 | 未来实现 |
|---|---|
| `fileStore.deleteFile(name)` | 调用 `POST /api/fs/delete`，成功后 `notify()` |
| `fileStore.createFolder(name)` | 调用 `POST /api/fs/create`，成功后 `notify()` |
| `fileStore.renameFiles(...)` | 调用 `PUT /api/fs/rename`，成功后 `notify()` |
| `paste()` (clipboardStore) | 批量调用 copy/move API，成功后 `notifyChange()` |

迁移时**不要修改方法签名**，保持组件层的调用方式不变。
