// CommandButtons.tsx
// 用途: 命令栏按钮组件, 包含新建、剪切、复制、粘贴、重命名等操作按钮; 
import "./CommandButtons.css";
import { Dropdown } from "../Dropdown";
import { NewOptions, SortOptions, ViewSwitcher, MoreOptions } from ".";

export const CommandButtons = () => {
  return (
    <div className="command-buttons">
      {/* 新建 在当前位置中创建一个新项目 */}
      <Dropdown trigger={"+"} title="新建">
        <NewOptions />
      </Dropdown>

      <button className="cmd-btn" title="剪切">✂️</button>
      <button className="cmd-btn" title="复制">📋</button>
      <button className="cmd-btn" title="粘贴">📄</button>
      <button className="cmd-btn" title="重命名">✏️</button>
      <button className="cmd-btn" title="共享">🔗</button>
      <button className="cmd-btn" title="删除">🗑️</button>

      {/* 排序 */}
      <Dropdown trigger={"🔽"} title="排序和分组选项">
        <SortOptions />
      </Dropdown>

      {/* 布局/视图 */}
      <Dropdown trigger={"🎨"} title="布局和视图选项">
        <ViewSwitcher />
      </Dropdown>

      {/* 更多 */}
      <Dropdown trigger={"..."} title="查看更多">
        <MoreOptions />
      </Dropdown>

      <button className="cmd-btn" title="GPT">
        📋
      </button>

      <button className="cmd-btn" title="显示或隐藏详细信息窗格">
        📋
      </button>
    </div>
  );
};
