// FolderTree.tsx
// 用途: 左侧导航窗口, 显示文件夹树结构, 支持展开/折叠;
import { useState } from "react";
import { useTabStore, tabStore } from "../../stores";
import { root, type FileNode } from "../../data/fileTree";
import "./FolderTree.css";

export const FolderTree = () => {
  return (
    <div className="folder-tree">
      <FolderTreeNode node={root} depth={0} parentPath="" />
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
  const [expanded, setExpanded] = useState(depth < 2);

  const folders = (node.children ?? []).filter((c) => c.type === "folder");

  return (
    <div className="tree-branch">
      <div className="tree-node" style={{ paddingLeft: depth * 16 + 8 }}
        onClick={() => {
          activeId && tabStore.navigateTo(activeId, currentPath);
          setExpanded((v) => !v);
        }}
      >
        <span className={`tree-arrow ${expanded ? "expanded" : ""}`}>
          {folders.length > 0 ? "▸" : "" }
        </span>
        <span className="tree-icon">📁</span>
        <span className="tree-name">{node.name}</span>
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
  const { selectedFile } = useTabStore();

  return (
    <div className="detail-pane">
      <div className="detail-section">
        <h3 className="detail-title">详细信息</h3>
        {selectedFile ? (
          <div className="detail-info">
            <p><span className="detail-label">名称:</span>{selectedFile.name}</p>
            <p><span className="detail-label">类型:</span>{selectedFile.type === "folder" ? "文件夹" : selectedFile.ext ?? "文件"}</p>
            {selectedFile.type === "file" && selectedFile.ext && (
              <p><span className="detail-label">扩展名:</span>{selectedFile.ext}</p>
            )}
          </div>
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