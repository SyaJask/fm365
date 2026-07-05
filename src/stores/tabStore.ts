// stores/tabStore.ts
// 用途: 管理选项卡的状态和操作;
import { useSyncExternalStore } from "react";
import type { Tab } from "../types/Tab";
import { root, getFilesByPath, type FileNode } from "../data/fileTree";

class TabStore {
  tabs: Tab[] = [];
  activeId: string | null = null;

  private listeners = new Set<() => void>();

  private notify() {
    const tab = this.tabs.find((t) => t.id === this.activeId);
    let selectedFile: FileNode | null = null;
    if (tab && this.selectedPaths.has(this.activeId!)) {
      const name = this.selectedPaths.get(this.activeId!)!;
      const files = getFilesByPath(root, tab.path);
      selectedFile = files.find((f) => f.name === name) ?? null;
    }
    this.snapshot = {
      tabs: this.tabs,
      activeId: this.activeId,
      canGoBack: this.activeId ? this.canGoBack(this.activeId) : false,
      canGoForward: this.activeId ? this.canGoForward(this.activeId) : false,
      selectedFile,
      searchQuery: this.searchQuery,
    };
    this.listeners.forEach((fn) => fn());
  };

  private snapshot: {
    tabs: Tab[];
    activeId: string | null;
    canGoBack: boolean;
    canGoForward: boolean;
    selectedFile: FileNode | null;
    searchQuery: string;
  } | null = null;

  private histories = new Map<string, { stack: string[]; index: number }>();

  private ensureHistory(id: string) {
    if (!this.histories.has(id)) {
      this.histories.set(id, { stack: [], index: -1 });
    };
    return this.histories.get(id)!;
  };

  private selectedPaths = new Map<string, string>();

  searchQuery: string = "";
  
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => {
    if (!this.snapshot) {
      this.notify();
    };
    return this.snapshot!;
  };

  constructor() {
    this.open({ id: "1", title: "主页", path: "D:/ai2all/fm365/src" });
    this.navigateTo("1", "D:/ai2all/fm365/src");
  }

  open(tab: Omit<Tab, "active">) {
    this.tabs = this.tabs.map((t) => ({...t, active: false }));

    const newTab: Tab = { ...tab, active: true };
    this.tabs = [...this.tabs, newTab];
    this.activeId = newTab.id;
    this.notify();
  };

  close(id: string) {
    const idx = this.tabs.findIndex((t) => t.id === id);
    if (idx === -1) return;

    const wasActive = this.tabs[idx].active;
    this.tabs = [
      ...this.tabs.slice(0,idx),
      ...this.tabs.slice(idx + 1),
    ];

    if (wasActive && this.tabs.length > 0) {
      const nextIdx = idx < this.tabs.length ? idx : idx - 1;
      this.tabs = this.tabs.map((t, i) =>
      i === nextIdx ? { ...t, active: true } : t
      );
      this.activeId = this.tabs[nextIdx].id;
    };

    if (this.tabs.length === 0) {
      this.activeId = null;
    };

    this.notify();
  };

  setActive(id: string) {
    this.tabs = this.tabs.map((t) => ({ ...t, active: t.id === id }));
    this.activeId = id;
    this.notify();
  };

  navigateTo(id: string, path: string) {
    const h = this.ensureHistory(id);
    // 若当前位置不是栈顶, 截断后面的
    h.stack = h.stack.slice(0, h.index + 1);
    h.stack.push(path);
    h.index = h.stack.length - 1;

    this.tabs = this.tabs.map((t) =>
      t.id === id ? { ...t, path, title: path.split("/").pop() ?? path } : t
    )
    this.selectedPaths.delete(id);
    this.notify();
  };

  goBack(id: string) {
    const h = this.ensureHistory(id);
    if (h.index <= 0) return;
    h.index--;
    const path = h.stack[h.index];
    this.tabs = this.tabs.map((t) =>
      t.id === id ? { ...t, path, title: path.split("/").pop() ?? path } : t
    );
    this.selectedPaths.delete(id);
    this.notify();
  };

  goForward(id: string) {
    const h = this.ensureHistory(id);
    if (h.index >= h.stack.length - 1) return;
    h.index++;
    const path = h.stack[h.index];
    this.tabs = this.tabs.map((t) =>
      t.id === id ? { ...t, path, title: path.split("/").pop() ?? path } : t
    );
    this.selectedPaths.delete(id);
    this.notify();
  };

  goUp(id: string) {
    const tab = this.tabs.find((t) => t.id === id);
    if (!tab) return;
    const path = tab.path.replace(/\/+$/, "");
    const parent = path.substring(0, path.lastIndexOf("/"));
    if (!parent || parent === "D:") {
      this.navigateTo(id, "D:");
    } else if (parent.startsWith("D:")) {
      this.navigateTo(id, parent);
    };
  };

  canGoBack(id: string): boolean {
    const h = this.histories.get(id);
    return h ? h.index > 0 : false;
  };

  canGoForward(id: string): boolean {
    const h = this.histories.get(id);
    return h ? h.index < h.stack.length - 1 : false;
  };

  selectFile(tabId: string, fileName: string | null) {
    if (fileName === null) {
      this.selectedPaths.delete(tabId);
    } else {
      this.selectedPaths.set(tabId, fileName);
    };
    this.notify();
  };

  
  setSearchQuery(query: string) {
    this.searchQuery = query;
    this.notify();
  };
};

export const useTabStore = () => {
  return useSyncExternalStore(
    tabStore.subscribe,
    tabStore.getSnapshot,
  );
};

export const tabStore = new TabStore();