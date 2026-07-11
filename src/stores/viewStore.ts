// stores/viewStore.ts
// 用途: 视图/排序/展开/重命名等 UI 状态
import { useSyncExternalStore } from "react";

type ViewMode = "list" | "thumbnails" | "details";
type SortBy = "name" | "date" | "type" | "size";
type SortOrder = "asc" | "desc";

interface ViewSnapshot {
  viewMode: ViewMode;
  sortBy: SortBy;
  sortOrder: SortOrder;
  expandedPaths: ReadonlySet<string>;
  renaming: string | null;
}

let viewMode: ViewMode = "list";
let sortBy: SortBy = "name";
let sortOrder: SortOrder = "asc";
let expandedPaths = new Set<string>(["D:", "D:/ai2all", "D:/ai2all/fm365"]);
let renaming: string | null = null;

let snapshot: ViewSnapshot | null = null;
const listeners = new Set<() => void>();

function notify() { snapshot = null; listeners.forEach((fn) => fn()); }

export function getSnapshot(): ViewSnapshot {
  if (!snapshot) snapshot = { viewMode, sortBy, sortOrder, expandedPaths, renaming };
  return snapshot;
}

export function setViewMode(mode: ViewMode) { viewMode = mode; notify(); }
export function setSortMethod(by: SortBy, order?: SortOrder) {
  if (by === sortBy && order) sortOrder = order; else { sortBy = by; sortOrder = "asc"; }
  notify();
}
export function setRenaming(fileName: string | null) { renaming = fileName; notify(); }

export function toggleExpanded(path: string) {
  const next = new Set(expandedPaths);
  if (next.has(path)) next.delete(path); else next.add(path);
  expandedPaths = next;
  notify();
}

export function expandToPath(path: string) {
  const next = new Set(expandedPaths);
  const parts = path.replace(/\/+$/, "").split("/");
  let acc = "";
  for (const part of parts) { acc = acc ? acc + "/" + part : part; next.add(acc); }
  expandedPaths = next;
  notify();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const useViewStore = () =>
  useSyncExternalStore(subscribe, getSnapshot);
