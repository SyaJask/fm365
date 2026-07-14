# fm365

极简风格的 Web 版文件管理器，参考 Windows 资源管理器的功能模块与交互风格。目标是成为一款可以真实管理文件、未来支持在线编辑的轻量级 Web 文件管理工具。

## 当前功能

- **多选项卡** — 打开、切换、关闭多个标签页，每页独立导航历史
- **面包屑导航** — 点击路径片段快速跳转
- **文件夹树** — 左侧递归展开/折叠，高亮当前路径
- **文件操作** — 新建、剪切、复制、粘贴、重命名、删除
- **多选** — 单击选中、全选、反转选择
- **视图切换** — 列表 / 缩略图 / 详情三种模式
- **排序** — 按名称/日期/类型/大小，递增或递减
- **搜索** — 关键词过滤当前目录文件

## 开发路线

| 阶段 | 目标 | 状态 |
|---|---|---|
| 1 | Mock 数据驱动，验证交互原型 | ✅ 进行中 |
| 2 | 接入真实文件系统 API（WebDAV / Tauri / 后端服务） | 📋 规划中 |
| 3 | 在线文件编辑（文本/Markdown） | 📋 规划中 |
| 4 | 用户权限、分享链接、云端同步 | 📋 远期 |

## 快速开始

```bash
npm install
npm run dev      # 开发模式（含 HMR + React Compiler）
npm run build    # 生产构建
npm run preview  # 预览构建产物
```

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | React 19 + TypeScript 6 |
| 构建 | Vite 8 + Rolldown |
| 编译优化 | babel-plugin-react-compiler |
| 状态管理 | `useSyncExternalStore`（零外部依赖） |
| 样式 | CSS Variables + 传统 `.css` 文件 |

## 项目结构

```
src/
├── stores/          # 状态管理（file/tab/selection/clipboard/view）
├── components/      # UI 组件（TitleBar/NavigationBar/CommandBar/FileView/FolderTree/StatusBar）
├── data/            # Mock 文件树数据（阶段 1 占位）
├── types/           # TypeScript 类型定义
├── utils/           # 工具函数（图标映射等）
└── App.tsx          # 根组件
```

## 设计决策

- **零外部状态库** — 所有 store 基于 `useSyncExternalStore` + 手动快照缓存实现，保持轻量
- **Mock → Real 过渡** — 当前使用内存 mock 数据，后续替换为真实 API 调用时，store 接口层已预留扩展点
- **React Compiler** — 启用自动 memoization，dev 模式下可能影响性能表现，属预期行为
