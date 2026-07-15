# Code Style Rules

适用场景：编辑 `src/**/*.ts`, `src/**/*.tsx`, `src/**/*.css` 时自动加载。

## 文件头注释

每个新文件的**第一行**必须是用途注释：

```ts
// 用途: <一句话说明文件职责>
import ...
```

放在 import 之前，不要放在文件顶部空行之后。

## Store 代码规范

- 类名 PascalCase，实例名 camelCase 单例，在文件末尾 `export const xxx = new XxxStore()`
- 状态用 `let` 声明（模块级），公开操作方法以独立函数导出
- 快照模式：`getSnapshot()` 懒计算 + `notify()` 清除缓存 + `subscribe()` 返回清理函数
- **MUST** — subscribe 返回值必须被 React 调用，否则内存泄漏

## 组件代码规范

- 文件夹结构：`src/components/<Name>/<Name>.tsx` + `<Name>.css` + `index.ts`
- barrel 文件只 re-export，不写逻辑
- 子组件定义在主组件之后，用 `const` 而非 `function`
- 样式类名用 BEM 风格（如 `tree-node`、`tree-arrow expanded`）
- **事件处理器**：单行表达式用 `onClick={() => fn()}`；多语句用块级 `onClick={(e) => { e.stopPropagation(); fn(); }}`，每条语句独占一行

## TypeScript 约束

- tsconfig 启用 `noUnusedLocals` / `noUnusedParameters`，删除代码时必须一并清理
- `verbatimModuleSyntax` 开启，import/export 必须使用原生语法，禁止 `import type` 混用
- `erasableSyntaxOnly` 开启，不允许非可擦除语法（如 `declare const` 带初始值）

## 代码长度控制

**认知复杂度 > 硬性行数。** 参考上限（不强制，适度重复优于过度抽象）：

| 类型 | 建议行数 |
|------|---------|
| 单个函数 | 20~50 行，嵌套 ≤ 3 层，参数 ≤ 5 个 |
| React 组件 | 100~250 行 |
| Hook | < 150 行 |
| Store | 100~300 行 |

关注点：30s 内理解文件职责、5min 内定位 Bug、改一个功能只动少数文件。

生成代码时控制在 150 行以内，超过时分多次输出，优先拆为独立函数或子组件。

**目录组织：** 按业务域（feature）组织比按技术类型更容易扩展。

** 项目整体评估：** 是否容易定位 / 修改 / 测试 / 扩展？

## 命名约定速查

| 实体 | 格式 | 示例 |
|---|---|---|
| Store 类 | PascalCase | `FileStore` |
| Store 实例 | camelCase 单例 | `fileStore` |
| Store hook | `use` + PascalCase | `useFileStore` |
| 组件 | PascalCase | `FileView` |
| 组件文件夹 | PascalCase | `FileView/` |
| 类型/接口 | PascalCase | `FileNode`, `Tab` |
| 变量/函数 | camelCase | `currentPath`, `getFileIcon` |
| CSS 类名 | kebab-case | `tree-node`, `breadcrumb-segment` |
