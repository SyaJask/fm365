// stores/clipboardStore.ts
// 用途: 剪切板状态管理 (cut / copy / paste)
import { useSyncExternalStore } from "react";
import { findNodeByPath } from "./fileStore";
import type { FileNode } from "../data/fileTree";
import { fileStore } from "./fileStore";

type ClipboardEntry = {
  operation: "cut" | "copy";
  fileNames: string[];
  sourcePath: string;
} | null;

interface ClipboardSnapshot {
  clipboard: ClipboardEntry;
}

let clipboard: ClipboardEntry = null;
let snapshot: ClipboardSnapshot | null = null;
const listeners = new Set<() => void>();

function notify() { snapshot = null; listeners.forEach((fn) => fn()); }

export function getSnapshot(): ClipboardSnapshot {
  if (!snapshot) snapshot = { clipboard };
  return snapshot;
}

export function cut(fileNames: string[]): boolean {
  if (fileNames.length === 0) return false;
  clipboard = { operation: "cut", fileNames, sourcePath: fileStore.currentPath };
  notify();
  return true;
}

export function copy(fileNames: string[]): boolean {
  if (fileNames.length === 0) return false;
  clipboard = { operation: "copy", fileNames, sourcePath: fileStore.currentPath };
  notify();
  return true;
}

/** 检查并确认跳过那些目标路径在其自身子树内的文件夹。返回 false 表示用户取消。 */
function confirmSkipSelfReferencing(
  src: { children?: FileNode[] },
  sourcePath: string,
  fileNames: string[],
): { skipped: string[]; confirmed: boolean } {
  const skipped: string[] = [];
  for (const f of fileNames) {
    const nodePath = sourcePath + "/" + f;
    const item = src.children?.find((c) => c.name === f);
    if (item?.type === "folder" &&
      (fileStore.currentPath === nodePath || fileStore.currentPath.startsWith(nodePath + "/"))) {
      skipped.push(f);
    }
  }
  if (skipped.length === 0) return { skipped, confirmed: true };
  const ok = window.confirm(
    `以下文件夹不能移入自身子树内, 将被跳过:\n${skipped.map((f) => `• ${f}`).join("\n")}\n\n是否继续粘贴其余项目?`
  );
  return { skipped, confirmed: ok };
}

export function paste(): boolean {
  if (!clipboard) return false;

  const { operation, fileNames, sourcePath } = clipboard;
  const src = findNodeByPath(fileStore.tree, sourcePath);
  if (!src?.children) return false;
  const dst = findNodeByPath(fileStore.tree, fileStore.currentPath);
  if (!dst?.children) return false;

  const { skipped, confirmed } = confirmSkipSelfReferencing(src, sourcePath, fileNames);
  if (!confirmed) return false;

  const pasted = new Set<string>();
  for (const fileName of fileNames) {
    const srcIdx = src.children.findIndex((c) => c.name === fileName);
    if (srcIdx === -1) continue;
    const node = src.children[srcIdx];

    // 跳过自身子树内的文件夹
    if (skipped.includes(fileName)) continue;

    if (sourcePath === fileStore.currentPath) {
      if (operation === "cut") continue;
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
      if (dst.children!.some((c) => c.name === node.name)) continue;
      const newNode: FileNode = { ...node };
      if (node.children) newNode.children = [...node.children];
      dst.children = [...dst.children, newNode];
      pasted.add(fileName);
    }
  }

  if (operation === "cut" && sourcePath !== fileStore.currentPath) {
    src.children = src.children.filter((c) => !pasted.has(c.name));
    clipboard = null;
  } else if (operation === "cut") {
    clipboard = null;
  }

  fileStore.notifyChange();
  return true;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export const useClipboardStore = () =>
  useSyncExternalStore(subscribe, getSnapshot);
