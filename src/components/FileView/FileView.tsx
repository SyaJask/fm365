// FileView.tsx
// 用途: 文件视图, 展示当前路径下的文件和文件夹;

import "./FileView.css";
import { useTabStore, tabStore } from "../../stores";
import { useFileStore, fileStore } from "../../stores";

export const FileView = () => {
  const { files, selectedFile, currentPath } = useFileStore();
  const { activeId, searchQuery } = useTabStore();

  const filtered: typeof files = files.filter((f) =>
    f.name.toLowerCase().includes((searchQuery ?? "").toLowerCase())
  );
  
  return (
    <div className="file-view">
      {filtered.map((file) => (
        <div key={file.name}
          className={`file-item ${selectedFile?.name === file.name ? "selected" : ""}`}
          onClick={() => fileStore.selectFile(file.name)}
          onDoubleClick={() => {
            if (file.type === "folder" && activeId) {
              const newPath = currentPath.replace(/\/+$/, "") + "/" + file.name;
              fileStore.selectFile(null);
              tabStore.navigateTo(activeId, newPath);
            };
          }}
        >
          <span className="file-icon">
            {file.type === "folder" ? "📁" : "📄"}
          </span>
          <span className="file-name">{file.name}</span>
        </div>
      ))}
    </div>
  );
};