// stores/fileStore.ts
// 用途: 文件树核心 — 数据 + 路径 + CRUD
import { useSyncExternalStore } from "react";
import { root as rootData, getFilesByPath, type FileNode } from "../data/fileTree";

export function findNodeByPath(tree: FileNode, rawPath: string): FileNode | null {
  const path = rawPath.replace(/\/+$/, "");
  if (path === tree.name) return tree;
  const rest = path.startsWith(tree.name + "/")
    ? path.slice(tree.name.length + 1) : path;
  const segments = rest.split("/").filter(Boolean);
  let current = tree;
  for (const seg of segments) {
    if (!current.children) return null;
    const found = current.children.find((c) => c.name === seg && c.type === "folder");
    if (!found) return null;
    current = found;
  }
  return current;
}

interface FileSnapshot {
  tree: FileNode;
  currentPath: string;
  files: FileNode[];
}

class FileStore {
  tree: FileNode = structuredClone(rootData);
  currentPath: string = "D:/ai2all/fm365/src";

  private listeners = new Set<() => void>();
  private snapshot: FileSnapshot | null = null;

  private notify() { this.snapshot = null; this.listeners.forEach((fn) => fn()); }
  /** 外部模块操作树后通知订阅者 (clipboardStore / selectionStore) */
  notifyChange() { this.notify(); }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => {
    if (!this.snapshot) {
      this.snapshot = {
        tree: this.tree,
        currentPath: this.currentPath,
        files: getFilesByPath(this.tree, this.currentPath),
      };
    }
    return this.snapshot;
  };

  setCurrentPath(path: string) { this.currentPath = path; this.notify(); }

  deleteFile(fileName: string): boolean {
    const parent = findNodeByPath(this.tree, this.currentPath);
    if (!parent?.children) return false;
    const idx = parent.children.findIndex((c) => c.name === fileName);
    if (idx === -1) return false;
    parent.children = [...parent.children.slice(0, idx), ...parent.children.slice(idx + 1)];
    this.notify(); return true;
  }

  createFolder(name: string): boolean {
    const parent = findNodeByPath(this.tree, this.currentPath);
    if (!parent?.children) return false;
    if (parent.children.some((c) => c.name === name && c.type === "folder")) return false;
    parent.children = [...parent.children, { name, type: "folder" }];
    this.notify(); return true;
  }

  createFile(name: string, ext: string): boolean {
    const parent = findNodeByPath(this.tree, this.currentPath);
    if (!parent?.children) return false;
    if (parent.children.some((c) => c.name === name)) return false;
    parent.children = [...parent.children, { name, type: "file", ext }];
    this.notify(); return true;
  }

  renameFiles(oldName: string, newName: string, batchNames?: string[]): boolean {
    const parent = findNodeByPath(this.tree, this.currentPath);
    if (!parent?.children) return false;
    if (parent.children.some((c) => c.name === newName)) return false;

    if (!batchNames || batchNames.length <= 1) {
      const idx = parent.children.findIndex((c) => c.name === oldName);
      if (idx === -1) return false;
      parent.children = [
        ...parent.children.slice(0, idx),
        { ...parent.children[idx], name: newName },
        ...parent.children.slice(idx + 1),
      ];
    } else {
      const base = newName.replace(/\.[^.]+$/, "");
      const ext = newName.includes(".") ? newName.slice(newName.lastIndexOf(".")) : "";
      const sorted = [...batchNames].sort((a, b) => a.localeCompare(b));
      let counter = 1;
      for (const fileName of sorted) {
        const idx = parent.children.findIndex((c) => c.name === fileName);
        if (idx === -1) continue;
        parent.children[idx] = { ...parent.children[idx], name: `${base} (${counter})${ext}` };
        counter++;
      }
      parent.children = [...parent.children];
    }
    this.notify(); return true;
  }
}

export const useFileStore = () =>
  useSyncExternalStore(fileStore.subscribe, fileStore.getSnapshot);

export const fileStore = new FileStore();
