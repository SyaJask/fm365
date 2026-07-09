// FileView.tsx
// 用途: 文件视图, 展示当前路径下的文件和文件夹;

import "./FileView.css";
import { getFileIcon } from "../../utils/icon";
import { useTabStore, tabStore } from "../../stores";
import { useFileStore, fileStore } from "../../stores";

export const FileView = () => {
  const { files, selectedFiles, currentPath, viewMode, sortOrder, renaming } = useFileStore();
  const { activeId, searchQuery } = useTabStore();

  const filtered: typeof files = files.filter((f) =>
    f.name.toLowerCase().includes((searchQuery ?? "").toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => {
    const dir = sortOrder === "asc" ? 1 : -1;
    // 文件夹始终排在前面
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name) * dir;
  });
  
  return (
    <div className={`file-view view-${viewMode}`}>
      {sorted.map((file) => (
        <div key={file.name}
          className={`file-item ${selectedFiles.some((f) => f.name === file.name) ? "selected" : ""}`}
          onClick={() => fileStore.selectFile(file.name)}
          onDoubleClick={() => {
            if (file.type === "folder" && activeId) {
              const newPath = currentPath.replace(/\/+$/, "") + "/" + file.name;
              fileStore.deselectAll();
              tabStore.navigateTo(activeId, newPath);
            };
          }}
        >
          <span className="file-icon">
            {getFileIcon(file.name, file.type)}
          </span>
          {renaming === file.name ? (
            <input className="rename-input" defaultValue={file.name}
              autoFocus onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const input = e.currentTarget;
                  const newName  = input.value.trim();
                  if (newName && newName !== file.name) {
                    fileStore.renameFile(file.name, newName);
                  }
                  fileStore.deselectAll();
                  fileStore.setRenaming(null);
                } else if (e.key === "Escape") {
                  fileStore.setRenaming(null);
                }
              }}
              onBlur={(e) => {
                const newName = e.currentTarget.value.trim();
                if (newName && newName !== file.name) {
                  fileStore.renameFile(file.name, newName);
                }
                fileStore.deselectAll();
                fileStore.setRenaming(null);
              }}
            />
          ) : (
            <span className="file-name">{file.name}</span>
          )}
          {viewMode === "details" && (
            <>
              <span className="file-type">
                {file.type === "folder" ? "文件夹" : file.ext ?? "-"}
              </span>
              <span className="file-size">-</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
};