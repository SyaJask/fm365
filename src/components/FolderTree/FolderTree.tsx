// FolderTree.tsx
// 用途: 左侧导航窗口, 显示文件夹树结构, 支持展开/折叠;
import "./FolderTree.css";
import { getFileIcon } from "../../utils/icon";
import { useFileStore, useTabStore, tabStore } from "../../stores";
import { useViewStore } from "../../stores";
import { useSelectionStore, selectFileAt, deselectAll } from "../../stores";
import { toggleExpanded } from "../../stores";
import { type FileNode } from "../../data/fileTree";

export const FolderTree = () => {
  const { tree } = useFileStore();

  return (
    <div className="folder-tree">
      <FolderTreeNode node={tree} depth={0} parentPath="" />
    </div>
  )
}

const FolderTreeNode = ({ node, depth, parentPath }: {
  node: FileNode;
  depth: number;
  parentPath: string;
}) => {
  const currentPath = depth === 0
    ? node.name
    : parentPath + "/" + node.name;
  const { activeId } = useTabStore();
  const { currentPath: activePath } = useFileStore();
  const { expandedPaths } = useViewStore();
  const expanded = expandedPaths.has(currentPath);
  const isActive = currentPath == activePath;
  const folders = (node.children ?? []).filter((c) => c.type === "folder");

  return (
    <div className="tree-branch">
      <div className={`tree-node ${isActive ? "active" : ""}`} style={{ paddingLeft: depth * 6 + 6 }}>
        <span className={`tree-arrow ${expanded ? "expanded" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleExpanded(currentPath);
          }}
        >
          {folders.length > 0 ? "▸" : "" }
        </span>
        <span className="tree-node-label"
          onClick={(e) => {
            if (!e.ctrlKey && !e.metaKey) {
              deselectAll();
              activeId && tabStore.navigateTo(activeId, currentPath);
            } else {
              selectFileAt(currentPath, node.name);
            }
          }}
        >
          <span className="tree-icon">
            {getFileIcon(node.name, node.type)}
          </span>
          <span className="tree-name">{node.name}</span>
        </span>
      </div>
      {expanded && folders.map((child) => (
        <FolderTreeNode key={child.name} node={child}
          depth={depth + 1} parentPath={currentPath}
        />
      ))}
    </div>
  );
};

// 右侧详细信息窗格, 显示选中文件的属性和 AI 助手
export const DetailPane = () => {
  const { selectedFiles } = useSelectionStore();

  return (
    <div className="detail-pane">
      <div className="detail-section">
        <h3 className="detail-title">详细信息</h3>
        {selectedFiles.length > 0 ? (
          selectedFiles.length === 1 ? (
            <div className="detail-info">
              <p><span className="detail-label">名称:</span>{selectedFiles[0].name}</p>
              <p><span className="detail-label">类型:</span>
                {selectedFiles[0].type === "folder" ? "文件夹" : selectedFiles[0].ext ?? "文件"}
              </p>
            </div>
          ) : (
            <p className="detail-hint">已选择 {selectedFiles.length} 个项目</p>
          )
        ) : (
          <p className="detail-hint">选择一个文件以查看其属性</p>
        )
        }
      </div>
      <div className="detail-section">
        <h3 className="detail-title">AI</h3>
        <p className="detail-hint">AI 助手功能即将上线</p>
      </div>
    </div>
  );
};
