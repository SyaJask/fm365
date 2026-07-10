// CommandBar.tsx
// 用途: 命令栏容器, 包含操作按钮和视图切换器; 
import "./CommandBar.css";
import { useFileStore, fileStore } from "../../stores";
import { NewOptions, SortOptions, MoreOptions, ViewSwitcher, Dropdown } from ".";

// 命令栏按钮组件, 包含新建、剪切、复制、粘贴、重命名等操作按钮;
export const CommandBar = () => {
  const { selectedFiles, clipboard } = useFileStore();
  const firstSelected = selectedFiles[0] ?? null;
  const lastSelected = selectedFiles[selectedFiles.length - 1] ?? null;

  return (
    <div className="command-bar">
      <div className="command-buttons">
        {/* 新建 在当前位置中创建一个新项目 */}
        <Dropdown trigger={"+"} title="新建"><NewOptions /></Dropdown>

        <button className="cmd-btn" title="剪切"
          disabled={selectedFiles.length === 0}
          onClick={() => selectedFiles.length > 0 && fileStore.cut(selectedFiles.map((f) => f.name))}
        >✂️</button>
        <button className="cmd-btn" title="复制"
          disabled={selectedFiles.length === 0}
          onClick={() => selectedFiles.length > 0 && fileStore.copy(selectedFiles.map((f) => f.name))}
        >📋</button>
        <button className="cmd-btn" title="粘贴"
          disabled={!clipboard}
          onClick={() => fileStore.paste()}
        >📄</button>
        <button className="cmd-btn" title="重命名"
          disabled={selectedFiles.length === 0} onClick={() =>
            lastSelected && fileStore.setRenaming(lastSelected.name)
          }
        >✏️</button>
        {/* TODO: 分享文件链接 */}
        <button className="cmd-btn" title="共享">🔗</button>
        <button className="cmd-btn" title="删除"
          disabled={selectedFiles.length === 0} onClick={() => {
            if (selectedFiles.length > 0) {
              for (const f of selectedFiles) {
                fileStore.deleteFile(f.name);
              }
              fileStore.deselectAll();
            }
          }}
        >🗑️</button>

        {/* 排序 */}
        <Dropdown trigger={"🔽"} title="排序和分组选项"><SortOptions /></Dropdown>
        {/* 布局/视图 */}
        <Dropdown trigger={"🎨"} title="布局和视图选项"><ViewSwitcher /></Dropdown>
        {/* 更多 */}
        <Dropdown trigger={"..."} title="查看更多"><MoreOptions /></Dropdown>
        {/* TODO: 通过接入API Key 接入主流GPT */}
        <button className="cmd-btn" title="GPT">📋</button>
        {/* TODO: 后期接入实际文件 */}
        <button className="cmd-btn" title="显示或隐藏详细信息窗格">📋</button>
      </div>
    </div>
  );
};
