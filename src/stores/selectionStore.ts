// stores/selectionStore.ts
// 用途: 多选状态管理
import { useSyncExternalStore } from "react";
import { getFilesByPath, type FileNode } from "../data/fileTree";
import { fileStore } from "./fileStore";

interface SelectionSnapshot {
  selectedFiles: FileNode[];
}

let snapshot: SelectionSnapshot | null = null;
const listeners = new Set<() => void>();

function notify() { snapshot = null; listeners.forEach((fn) => fn()); }

const selectedPaths = new Map<string, Set<string>>();

export function getSelectedNames(path: string): string[] {
  const s = selectedPaths.get(path);
  return s ? [...s] : [];
}

/* ---------- 读取快照 ---------- */

export function getSnapshot(): SelectionSnapshot {
  if (!snapshot) {
    const files = getFilesByPath(fileStore.tree, fileStore.currentPath);
    const names = selectedPaths.get(fileStore.currentPath) ?? new Set();
    snapshot = { selectedFiles: files.filter((f) => names.has(f.name)) };
  }
  return snapshot;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const useSelectionStore = () =>
  useSyncExternalStore(subscribe, getSnapshot);

/* ---------- 操作方法 ---------- */

export function selectFile(fileName: string) {
  selectFileAt(fileStore.currentPath, fileName);
}

export function selectFileAt(dirPath: string, fileName: string) {
  let set = selectedPaths.get(dirPath);
  if (!set) { set = new Set(); selectedPaths.set(dirPath, set); }
  if (set.has(fileName)) set.delete(fileName); else set.add(fileName);
  if (set.size === 0) selectedPaths.delete(dirPath);
  notify();
}

export function selectAll() {
  const files = getFilesByPath(fileStore.tree, fileStore.currentPath);
  selectedPaths.set(fileStore.currentPath, new Set(files.map((f) => f.name)));
  notify();
}

export function invertSelection() {
  const files = getFilesByPath(fileStore.tree, fileStore.currentPath);
  const current = selectedPaths.get(fileStore.currentPath) ?? new Set();
  const inverted = new Set<string>();
  for (const f of files) { if (!current.has(f.name)) inverted.add(f.name); }
  selectedPaths.set(fileStore.currentPath, inverted);
  if (inverted.size === 0) selectedPaths.delete(fileStore.currentPath);
  notify();
}

export function deselectAll() {
  selectedPaths.delete(fileStore.currentPath);
  notify();
}

/**
 * 通知选中状态变更（外部修改树后调用）
 * fileStore.notifyChange 会刷新 tree/files, selectionStore 靠它被动渲染
 */
export function onTreeChanged() {
  // 路径变了或树变了 → 选中可能失效 → 重建快照
  snapshot = null;
}
