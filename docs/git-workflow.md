# Git Workflow

## 分支策略

当前为单分支开发，所有功能直接在 `main` 上提交。后续引入协作时再升级为 Git Flow。

## 提交规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
type(scope): 描述

# 示例
feat(store): split monolithic fileStore into selection/clipboard/view stores
fix(viewStore): correct snapshot null check in notify()
```

### Type 列表

| Type | 说明 | 示例 |
|---|---|---|
| `feat` | 新功能 | `feat(CommandBar): add batch rename` |
| `fix` | Bug 修复 | `fix(store): correct snapshot null check` |
| `refactor` | 重构（不改行为） | `refactor(store): split monolithic fileStore` |
| `style` | 样式/格式化（不改逻辑） | `style: polish NavigationBar interactions` |
| `docs` | 文档变更 | `docs: update CLAUDE.md` |
| `chore` | 构建/工具/杂项 | `chore: update vite to v8` |

### Scope 建议

常用 scope 与代码位置对应：

| Scope | 对应文件/目录 |
|---|---|
| `store` | `src/stores/` |
| `FileView` | `src/components/FileView/` |
| `CommandBar` | `src/components/CommandBar/` |
| `FolderTree` | `src/components/FolderTree/` |
| `NavigationBar` | `src/components/NavigationBar/` |
| `TitleBar` | `src/components/TitleBar/` |
| `StatusBar` | `src/components/StatusBar/` |
| `types` | `src/types/` |
| `data` | `src/data/` |
| `utils` | `src/utils/` |

## 后续升级路径

当项目进入多开发者阶段时，升级为：

```
main          — 稳定版本，仅接受 PR
feature/*     — 功能分支，完成后合并到 main
```
