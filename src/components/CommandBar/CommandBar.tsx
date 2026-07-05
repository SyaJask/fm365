// CommandBar.tsx
// 用途: 命令栏容器, 包含操作按钮和视图切换器; 
import "./CommandBar.css";
// import { CommandButtons } from ".";
import { Dropdown } from "../Dropdown";
import { SortOptions, ViewSwitcher, MoreOptions } from ".";

// 新建操作下拉内容, 嵌入 Dropdown 使用;
const NewOptions = () => {
  return (
    <>
      <button className="dropdown-item">新建文件夹</button>
      <button className="dropdown-item">新建文本文档</button>
      <button className="dropdown-item">新建 Markdown</button>
    </>
  );
};

// 命令栏按钮组件, 包含新建、剪切、复制、粘贴、重命名等操作按钮;
export const CommandBar = () => {
  return (
    <div className="command-bar">
      <div className="command-buttons">
        {/* 新建 在当前位置中创建一个新项目 */}
        <Dropdown trigger={"+"} title="新建"><NewOptions /></Dropdown>

        <button className="cmd-btn" title="剪切">✂️</button>
        <button className="cmd-btn" title="复制">📋</button>
        <button className="cmd-btn" title="粘贴">📄</button>
        <button className="cmd-btn" title="重命名">✏️</button>
        <button className="cmd-btn" title="共享">🔗</button>
        <button className="cmd-btn" title="删除">🗑️</button>

        {/* 排序 */}
        <Dropdown trigger={"🔽"} title="排序和分组选项"><SortOptions /></Dropdown>
        {/* 布局/视图 */}
        <Dropdown trigger={"🎨"} title="布局和视图选项"><ViewSwitcher /></Dropdown>
        {/* 更多 */}
        <Dropdown trigger={"..."} title="查看更多"><MoreOptions /></Dropdown>
        <button className="cmd-btn" title="GPT">📋</button>
        <button className="cmd-btn" title="显示或隐藏详细信息窗格">📋</button>
      </div>
    </div>
  );
};
