// stores/fileStore.ts
// 用途: 管理文件树数据和文件操作（选中、删除、新建、重命名）
import { useSyncExternalStore } from "react";
import { root as rootData, getFilesByPath, type FileNode } from "../data/fileTree";

interface FileSnapshot {
  tree: FileNode;
  currentPath: string;
  files: FileNode[];
  selectedFile: FileNode | null;
}

function findNodeByPath(tree: FileNode, rawPath: string): FileNode | null {
  const path = rawPath.replace(/\/+$/, "");
  if (path === tree.name) return tree;

  const rest = path.startsWith(tree.name + "/")
    ? path.slice(tree.name.length + 1)
    : path;
  
  const segments = rest.split("/").filter(Boolean);
  let current = tree;
  for (const seg of segments) {
    if (!current.children) return null;
    const found = current.children.find(
      (c) => c.name === seg && c.type === "folder"
    );
    if (!found) return null;
    current = found;
  };
  return current;
}

class FileStore {
  // 可变文件树（深拷贝初始数据）
  tree: FileNode = structuredClone(rootData);
  currentPath: string = "D:/ai2all/fm365/src";

  private selectedPaths = new Map<string, string>();
  private listeners = new Set<() => void>();
  private snapshot: FileSnapshot | null = null;

  private notify() {
    this.snapshot = null;  // 清缓存，下次 getSnapshot 重建
    this.listeners.forEach((fn) => fn());
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => {
    // 先返回简单版本，后面 tabStore 传 path 进来再完善
    if (!this.snapshot) {
      const files = getFilesByPath(this.tree, this.currentPath);
      const name = this.selectedPaths.get(this.currentPath);
      this.snapshot = {
        tree: this.tree,
        currentPath: this.currentPath,
        files,
        selectedFile: name ? files.find((f) => f.name === name) ?? null : null,
      };
    }
    return this.snapshot;
  };

  setCurrentPath(path: string) {
    this.currentPath = path;
    this.selectedPaths.delete(path);  // 切路径时清选中
    this.notify();
  }

  selectFile(fileName: string | null) {
    if (fileName === null) {
      this.selectedPaths.delete(this.currentPath);
    } else {
      this.selectedPaths.set(this.currentPath, fileName);
    }
    this.notify();
  }

  getSelected(path: string): FileNode | null {
    const name = this.selectedPaths.get(path);
    if (!name) return null;
    const files = getFilesByPath(this.tree, path);
    return files.find((f) => f.name === name) ?? null;
  }

  deleteFile(fileName: string): boolean {
    const parent = findNodeByPath(this.tree, this.currentPath);
    if (!parent?.children) return false;

    const idx = parent.children.findIndex((c) => c.name === fileName);
    if (idx === -1) return false;

    parent.children.splice(idx, 1);
    this.notify();
    return true;
  }
}

export const useFileStore = () => {
  return useSyncExternalStore(
    fileStore.subscribe,
    fileStore.getSnapshot,
  );
};

export const fileStore = new FileStore();
