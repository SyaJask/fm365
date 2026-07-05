// FolderTree.tsx
// 用途: 左侧导航窗口, 显示文件夹树结构, 支持展开/折叠;
import { useState } from "react";
import { useTabStore, tabStore } from "../../stores";
import { root } from "../../data/fileTree";
import type { FileNode } from "../../data/fileTree";
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
      <div
        className="tree-node"
        style={{ paddingLeft: depth * 16 + 8 }}
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
        <FolderTreeNode
          key={child.name}
          node={child}
          depth={depth + 1}
          parentPath={currentPath}
        />
      ))}
    </div>
  )
}