// FileView.tsx
// 用途: 文件视图, 展示当前路径下的文件和文件夹;

import "./FileView.css";
import { useState } from "react";
import { useTabStore } from "../../stores";

interface FileEntry {
  name: string;
  type: "folder" | "file";
  ext?: string;  // 如 ".tsx", ".md"
}

// 暂时硬编码 mock 数据
const mockFiles: FileEntry[] = [
  { name: "src", type: "folder" },
  { name: "public", type: "folder" },
  { name: "node_modules", type: "folder" },
  { name: "index.html", type: "file", ext: ".html" },
  { name: "package.json", type: "file", ext: ".json" },
  { name: "vite.config.ts", type: "file", ext: ".ts" },
  { name: "README.md", type: "file", ext: ".md" },
];

const mockFilesByPath: Record<string, FileEntry[]> = {
  "D:/ai2all/fm365/src/compoents": [
    { name: "CommandBar", type: "folder" },
    { name: "ExplorerWindow", type: "folder" },
    { name: "NavigationBar", type: "folder" },
    { name: "TitleBar", type: "folder" },
    { name: "FileView", type: "folder" },
    { name: "Dropdown", type: "folder" },
    { name: "App.tsx", type: "file", ext: ".tsx" },
    { name: "main.tsx", type: "file", ext: ".tsx" },
  ],
};

export const FileView = () => {
  const { tabs, activeId } = useTabStore();
  const activeTab = tabs.find((t) => t.id === activeId);

  const files = activeTab
    ? mockFilesByPath[activeTab.path] ?? []
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
            if (file.type === "folder") {
                // TODO: 进入文件夹
                console.log("open folder:", file.name)
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