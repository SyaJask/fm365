# CLAUDE.md

**最高优先级 — 行为约束。以下规则覆盖本文档所有其他内容：**

1. **停就是立刻停。** 用户说"停"或任何停止信号，立刻停止所有操作——不完成当前步骤，不撤销已做的事，不换个方式继续，不做任何工具调用，不做任何文件操作。零延迟，零后续动作。停就是停，不是"停然后修"。
2. **审查是提建议，不是改代码。** 用户说"审查"时只列出发现和建议，等用户确认后再动手。
3. **先看已有的再操作。** 检查完成情况前先看 commit 和已有文件，不重复创建。
4. **修改 CLAUDE.md 必须经用户确认。** 不能擅自编辑。
5. **写完代码后不自动 git commit/push。** 等用户确认后再决定是否提交。

---

本文档为 Claude Code (claude.ai/code) 提供本仓库的代码操作指导。

## 项目概述

**fm365** — 内网部署的 Web 文件管理器，主机存文件，同事通过浏览器访问和管理。参考 Windows 资源管理器交互。

- **前端技术栈**：React 19 + TypeScript + Vite (Rolldown) + React Compiler 自动 memoization
- **当前阶段**：用 mock 数据验证交互原型；Express + SQLite 后端骨架已搭建（JWT 鉴权）
- **下一步**：2b 前端登录页 + 鉴权流程；2c 接入真实文件系统 API
- 详细功能清单、技术栈、开发路线见 [README.md](README.md)

## 架构设计

### 状态管理 — `useSyncExternalStore` 模式

项目**不使用任何外部状态库**。每个 store 都是普通类或模块级单例，实现 `useSyncExternalStore` 契约：

| Store | 文件 | 职责 |
|---|---|---|
| `fileStore` | [stores/fileStore.ts](src/stores/fileStore.ts) | 核心文件树数据、当前路径、CRUD。class 实例单例。 |
| `tabStore` | [stores/tabStore.ts](src/stores/tabStore.ts) | 选项卡管理、每页独立导航历史栈、搜索关键词。class 实例单例。 |
| `selectionStore` | [stores/selectionStore.ts](src/stores/selectionStore.ts) | 多选状态，按当前路径索引。模块级单例。 |
| `clipboardStore` | [stores/clipboardStore.ts](src/stores/clipboardStore.ts) | 剪切/复制/粘贴，含源路径追踪。模块级单例。 |
| `viewStore` | [stores/viewStore.ts](src/stores/viewStore.ts) | 视图模式、排序、展开状态、重命名目标、详情面板可见性。模块级单例。 |

所有 store 同时导出 hook（`useXxxStore`）和命令式操作函数，通过 [stores/index.ts](src/stores/index.ts) barrel 统一对外暴露。变更通知流程：`notify()` → 清除快照 → `useSyncExternalStore` 触发 React 重渲染。

**隐式耦合注意** — tabStore 的主动作方法（`navigateTo`、`goBack`、`goForward`、`goUp`、`paste`）内部会跨 store 调用 `fileStore.setCurrentPath()` 和 `viewStore.expandToPath()`，新增此类方法时先参考现有方法的跨 store 调用模式，避免循环依赖。

### 组件结构

```
App
├── TitleBar          — 选项卡条（新增/关闭/切换）
├── NavigationBar     — 前进/后退/上翻按钮 + 面包屑路径 + 搜索框
├── CommandBar        — 操作工具栏（新建/剪切/复制/粘贴/重命名/删除/排序/视图）
│   ├── NewOptions / SortOptions / MoreOptions / ViewSwitcher
├── FolderTree        — 左侧边栏：递归文件夹树
│   └── DetailPane    — 右侧面板：选中文件属性 + AI 占位
├── FileView          — 主区域：文件列表/网格，键盘快捷键处理集中在此
└── StatusBar         — 底部状态栏：项目计数
```

每个组件位于 `src/components/<名称>/` 独立文件夹下，包含 `index.ts` barrel 文件和 `<名称>.css` 样式文件。

### 数据层

- `src/data/fileTree.ts` — 静态 mock 文件树（根节点 `D:/ai2all/fm365/src`），导出 `root`、`getFilesByPath()`、`getNodeByPath()`
- `src/utils/icon.ts` — `getFileIcon(name, type)` 返回 emoji 图标字符串
- 后续接入真实 API 时的接口约定见 [docs/api-conventions.md](docs/api-conventions.md)

### 样式与布局

- 全局 CSS 变量定义在 [src/index.css](src/index.css)（`--base`、`--surface`、`--accent` 等），组件样式不覆盖全局变量
- 布局基于 flexbox：窗口垂直列 → 主区域水平行（folder-tree | content-area | detail-pane）

### TypeScript 配置

根 [tsconfig.json](tsconfig.json) 引用三个子配置：
- `tsconfig.app.json` — 应用代码（jsx react-jsx、strict、`verbatimModuleSyntax`、`erasableSyntaxOnly`）
- `tsconfig.node.json` — Vite 配置和工具链
- `tsconfig.server.json` — 后端 server/（nodenext、strict）

## 配置与偏好

- `.claude/settings.json` — 运行时配置（权限、钩子、环境变量），纳入版本控制
- `CLAUDE.local.md` — 个人本地覆盖（额外权限、API 地址、行为偏好），不纳入版本控制

## 后端 (server/)

| 文件 | 职责 |
|---|---|
| `server/index.ts` | Express 入口，挂载 `/api` 路由，生产环境 serve `dist/` |
| `server/db.ts` | SQLite（better-sqlite3），`users` 表 |
| `server/middleware/auth.ts` | JWT 中间件 `requireAuth` |
| `server/routes/auth.ts` | `POST /register`、`POST /login`、`GET /me` |

### 启动命令

- `npm run dev` — concurrently 启动 Vite (:5173) + Express (:3001)，Vite proxy `/api` → `:3001`
- `npm start` — 生产模式，Express 单端口 serve 前端 + API
- `server/data.db` 已 gitignore

后端改动集中在 `server/`，不碰 `src/`。

## 注意事项 (Gotchas)

- **Mock 数据** — 所有 CRUD 仅在内存副本（`structuredClone(root)`）上进行，重启后丢失。不要假设数据持久化。
- **快照缓存** — 各 store 使用 `getSnapshot()` 懒计算缓存，变更时必须手动 `snapshot = null` 失效，否则 React 不会重渲染。
- **React Compiler** — 项目通过 `@rolldown/plugin-babel` + `babel-plugin-react-compiler` 启用自动 memoization，dev 模式下可能影响性能表现，属预期行为。
- **ESM 导入** — package.json `"type": "module"`，server 代码中本地导入需加 `.js` 扩展名（`./routes/auth.js`），tsx 会自动解析到 `.ts` 源文件。

## 维护说明

本文档随代码同步演进。新增功能或踩到新坑时立即追加；发现过时/冲突内容时直接删除。**保持精简，上下文是宝贵的。**

### 文档分流

各领域文档按职责分流，不在本文件重复：编码规范 → `.claude/rules/code-style.md`，安全规则 → `.claude/rules/security.md`，API 约定 → [docs/api-conventions.md](docs/api-conventions.md)，Git 流程 → [docs/git-workflow.md](docs/git-workflow.md)。

### 修改后验证

完成修改后提示用户手动跑一次交互验证（新建→重命名→剪切→粘贴→删除），这比 `tsc -b --noEmit` 更有意义。IDE 实时诊断已覆盖类型检查。

### 交互检查清单

修改多个文件后、声称"无逻辑/交互问题"前，必须逐项确认：

1. 组件的 import 来自正确的 store（FileView 从 viewStore 拿 viewMode，不是 fileStore）
2. 方法参数与函数签名匹配（如 `getSelectedNames(fileStore.currentPath)` 需要传 path）
3. 跨组件链路完整（FolderTree 点击 → navigateTo → setCurrentPath → expandToPath）
4. 键盘快捷键调用的函数位于正确的 store 上
