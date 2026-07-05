// FileView.tsx
// 用途: 文件视图, 展示当前路径下的文件和文件夹;

import "./FileView.css";
import { useState } from "react";
import { useTabStore, tabStore } from "../../stores";
import { root, getFilesByPath } from "../../data/fileTree";
import type { FileNode } from "../../data/fileTree";

export const FileView = () => {
  const { tabs, activeId } = useTabStore();
  const activeTab = tabs.find((t) => t.id === activeId);

  const files: FileNode[] = activeTab
    ? getFilesByPath(root, activeTab.path)
    : [];
  
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="file-view">
      {files.map((file) => (
        <div
          key={file.name}
          className={`file-item ${selected === file.name ? "selected" : ""}`}
          onClick={() => setSelected(file.name)}
          onDoubleClick={() => {
            if (file.type === "folder" && activeId) {
              const newPath = activeTab?.path.replace(/\/+$/, "") + "/" + file.name;
              tabStore.navigateTo(activeTab.id, newPath);
            };
          }}
        >
          <span className="file-icon">
            {file.type === "folder" ? "📁" : "📄"}
          </span>
          <span className="file-name">{file.name}</span>
        </div>
      ))},
    </div>
  );
};