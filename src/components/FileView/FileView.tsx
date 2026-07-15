// FileView.tsx
// 用途: 文件视图, 展示当前路径下的文件和文件夹;

import "./FileView.css";
import { getFileIcon } from "../../utils/icon";
import { useTabStore, tabStore } from "../../stores";
import { useFileStore, fileStore } from "../../stores";
import { useViewStore, setRenaming } from "../../stores";
import { useSelectionStore, selectFile, selectAll, deselectAll, getSelectedNames } from "../../stores";
import { cut, copy, paste } from "../../stores";

export const FileView = () => {
  const { files, currentPath } = useFileStore();
  const { viewMode, sortOrder, renaming } = useViewStore();
  const { selectedFiles } = useSelectionStore();
  const { activeId, searchQuery } = useTabStore();

  const filtered: typeof files = files.filter((f) =>
    f.name.toLowerCase().includes((searchQuery ?? "").toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => {
    const dir = sortOrder === "asc" ? 1 : -1;
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name) * dir;
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (renaming) return;
    const ctrl = e.ctrlKey || e.metaKey;

    const files = selectedFiles;
    const shortcuts: Record<string, () => void> = {
      Delete: () => {
        if (files.length === 0) return;
        for (const f of files) fileStore.deleteFile(f.name);
        deselectAll();
      },
      c: () => { if (files.length > 0) copy(files.map((f) => f.name)); },
      x: () => { if (files.length > 0) cut(files.map((f) => f.name)); },
      v: () => paste(),
      a: () => selectAll(),
      F5: () => fileStore.refresh(),
    };

    const modShortcuts = new Set(["c", "x", "v", "a"]);
    const key = e.key;
    const handler = shortcuts[key];

    if (handler && (modShortcuts.has(key) ? ctrl : true)) {
      e.preventDefault();
      handler();
    }
  };

  return (
    <div className={`file-view view-${viewMode}`}
      tabIndex={0} onKeyDown={handleKeyDown}
    >
      {sorted.map((file) => (
        <div key={file.name}
          className={`file-item ${selectedFiles.some((f) => f.name === file.name) ? "selected" : ""}`}
          onClick={(e) => {
            if (!e.ctrlKey && !e.metaKey) deselectAll();
            selectFile(file.name);
          }}
          onDoubleClick={() => {
            if (file.type === "folder" && activeId) {
              const newPath = currentPath.replace(/\/+$/, "") + "/" + file.name;
              deselectAll();
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
                  const newName = input.value.trim();
                  if (newName && newName !== file.name) {
                    fileStore.renameFiles(file.name, newName, getSelectedNames(fileStore.currentPath));
                  }
                  deselectAll();
                  setRenaming(null);
                } else if (e.key === "Escape") {
                  setRenaming(null);
                }
              }}
              onBlur={(e) => {
                const newName = e.currentTarget.value.trim();
                if (newName && newName !== file.name) {
                  fileStore.renameFiles(file.name, newName, getSelectedNames(fileStore.currentPath));
                }
                deselectAll();
                setRenaming(null);
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
