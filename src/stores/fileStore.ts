// stores/fileStore.ts
// 用途: 管理文件树数据和文件操作（选中、删除、新建、重命名）
import { useSyncExternalStore } from "react";
import { root as rootData, getFilesByPath, type FileNode } from "../data/fileTree";

type ClipboardEntry = {
  operation: "cut" | "copy";
  fileName: string;
  sourcePath: string;
} | null;

interface FileSnapshot {
  tree: FileNode;
  currentPath: string;
  files: FileNode[];
  selectedFiles: FileNode[];
  clipboard: ClipboardEntry;
  viewMode: "list" | "thumbnails" | "details";
  sortBy: "name" | "date" | "type" | "size";
  sortOrder: "asc" | "desc";
  expandedPaths: ReadonlySet<string>;
  renaming: string | null;
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

  private selectedPaths = new Map<string, Set<string>>();
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
      const names = this.selectedPaths.get(this.currentPath) ?? new Set();
      this.snapshot = {
        tree: this.tree,
        currentPath: this.currentPath,
        files,
        selectedFiles: files.filter((f) => names.has(f.name)),
        clipboard: this.clipboard,
        viewMode: this.viewMode,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
        expandedPaths: this.expandedPaths,
        renaming: this.renaming,
      };
    }
    return this.snapshot;
  };

  setCurrentPath(path: string) {
    this.currentPath = path;
    this.notify();
  }

  selectFile(fileName: string) {
    let set = this.selectedPaths.get(this.currentPath);
    if (!set) {
      set = new Set<string>();
      this.selectedPaths.set(this.currentPath, set);
    }
    // toggle: 有就删没就加
    if (set.has(fileName)) {
      set.delete(fileName);
    } else {
      set.add(fileName);
    }
    // 空set 就删key
    if (set.size === 0) {
      this.selectedPaths.delete(this.currentPath);
    }
    this.notify();
  }

  // selectAll / invert / deselectAll
  selectAll() {
    const files = getFilesByPath(this.tree, this.currentPath);
    this.selectedPaths.set(this.currentPath, new Set(files.map((f) => f.name)));
    this.notify();
  }

  invertSelection() {
    const files = getFilesByPath(this.tree, this.currentPath);
    const current = this.selectedPaths.get(this.currentPath) ?? new Set();
    const inverted = new Set<string>();
    for (const f of files) {
      if (!current.has(f.name)) inverted.add(f.name);
    }
    this.selectedPaths.set(this.currentPath, inverted);
    if (inverted.size === 0) this.selectedPaths.delete(this.currentPath);
    this.notify();
  }

  deselectAll() {
    this.selectedPaths.delete(this.currentPath);
    this.notify();
  }

  deleteFile(fileName: string): boolean {
    const parent = findNodeByPath(this.tree, this.currentPath);
    if (!parent?.children) return false;

    const idx = parent.children.findIndex((c) => c.name === fileName);
    if (idx === -1) return false;

    parent.children = [
      ...parent.children.slice(0, idx),
      ...parent.children.slice(idx + 1),
    ];
    this.notify();
    return true;
  }

  createFolder(name: string): boolean {
    const parent = findNodeByPath(this.tree, this.currentPath);
    if (!parent?.children) return false;

    // 检查重名
    if (parent.children.some((c) => c.name === name && c.type === "folder")) {
      return false;
    }

    parent.children = [...parent.children, { name, type: "folder"}];
    this.notify();
    return true;
  }

  createFile(name: string, ext: string): boolean {
    const parent = findNodeByPath(this.tree, this.currentPath);
    if (!parent?.children) return false;

    if (parent.children.some((c) => c.name === name)) {
      return false;
    }

    parent.children = [...parent.children, { name, type: "file", ext}];
    this.notify();
    return true;
  }

  renameFile(oldName: string, newName: string): boolean {
    const parent = findNodeByPath(this.tree, this.currentPath);
    if (!parent?.children) return false;

    // 重命名检查
    if (parent.children.some((c) => c.name === newName)) {
      return false;
    }

    const idx = parent.children.findIndex((c) => c.name === oldName);
    if (idx === -1) return false;

    const node = parent.children[idx];

    // 新数组引用
    parent.children = [
      ...parent.children.slice(0, idx),
      { ...node, name: newName },
      ...parent.children.slice(idx + 1),
    ];
    this.notify();
    return true;
  }

  // 剪切板类型
  clipboard: ClipboardEntry = null;

  // 剪切
  cut(fileName: string): boolean {
    this.clipboard = {
      operation: "cut",
      fileName,
      sourcePath: this.currentPath
    };
    return true;  // 不notify, 下次cut/copy 会覆盖
  }

  // 复制
  copy(fileName: string): boolean {
    this.clipboard = {
      operation: "copy",
      fileName,
      sourcePath: this.currentPath
    };
    return true;
  }

  // 粘贴
  paste(): boolean {
    if (!this.clipboard) return false;

    const { operation, fileName, sourcePath } = this.clipboard;
    const src = findNodeByPath(this.tree, sourcePath);
    if (!src?.children) return false;

    const srcIdx = src.children.findIndex((c) => c.name === fileName);
    if (srcIdx === -1) return false;

    const node = src.children[srcIdx];
    const dst = findNodeByPath(this.tree, this.currentPath);
    if (!dst?.children) return false;

    // 粘贴到当前目录, 避免与同目录下自己粘贴到同一目录
    if (sourcePath === this.currentPath && operation === "copy") {
      // 同目录复制 -> 重命名
      const base = node.name.replace(/\.[^.]+$/, "");
      const ext = node.ext ?? "";
      let copyName = `${base} - 副本${ext}`;
      let counter = 2;
      while (dst.children!.some((c) => c.name === copyName)) {
        copyName = `${base} - 副本 (${counter})${ext}`;
        counter++;
      }
      const newNode: FileNode = { ...node, name: copyName };
      if (node.children) newNode.children = [...node.children];
      dst.children = [...dst.children, newNode];
    } else {
      // 不同目录, 或cut -> 先粘过去
      if (dst.children!.some((c) => c.name === node.name)) return false;

      const newNode: FileNode = { ...node };
      if (node.children) newNode.children = [...node.children];
      dst.children = [...dst.children, newNode];

      // cut 要从源删除
      if (operation === "cut") {
        src.children = [
          ...src.children.slice(0, srcIdx),
          ...src.children.slice(srcIdx + 1),
        ];
        this.clipboard = null;
      }
    }

    this.notify();
    return true;
  }

  viewMode: "list" | "thumbnails" | "details" = "list";
  setViewMode(mode: "list" | "thumbnails" | "details") {
    this.viewMode = mode;
    this.notify();
  }

  sortBy: "name" | "date" | "type" | "size" = "name";
  sortOrder: "asc" | "desc" = "asc";
  setSortMethod(by: "name" | "date" | "type" | "size", order?: "asc" | "desc") {
    if (by === this.sortBy && order) {
      this.sortOrder = order;
    } else {
      this.sortBy = by;
      this.sortOrder = "asc";
    }
    this.notify();
  }

  expandedPaths = new Set<string>(["D:", "D:/ai2all", "D:/ai2all/fm365"]);
  toggleExpanded(path: string) {
    const next = new Set(this.expandedPaths);
    if (next.has(path)) {
      next.delete(path);
    } else {
      next.add(path);
    }
    this.expandedPaths = next
    this.notify();
  }

  expandToPath(path: string) {
    const next = new Set(this.expandedPaths);
    // 从根到目标路径, 每段都展开
    const parts = path.replace(/\/+$/, "").split("/");
    let acc = "";
    for (const part of parts) {
      acc = acc ? acc + "/" + part : part;
      next.add(acc);
    }
    this.expandedPaths = next;
    this.notify();
  }

  renaming: string | null = null;
  setRenaming(fileName: string | null) {
    this.renaming = fileName;
    this.notify();
  }
}

export const useFileStore = () => {
  return useSyncExternalStore(
    fileStore.subscribe,
    fileStore.getSnapshot,
  );
};

export const fileStore = new FileStore();
