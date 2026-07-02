// stores/tabStore.ts
// 用途: 管理选项卡的状态和操作。
import { useSyncExternalStore } from "react";
import type { Tab } from "../types/Tab";

class TabStore {
  tabs: Tab[] = [];
  activeId: string | null = null;

  private listeners = new Set<() => void>();

  private notify() {
    console.log("TabStore notify: ", this.tabs, this.activeId, this.tabs.length);
    this.snapshot = { tabs: this.tabs, activeId: this.activeId };
    this.listeners.forEach((fn) => fn());
  };

  private snapshot: { tabs: Tab[], activeId: string | null } | null = null;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => {
    if (!this.snapshot) {
      this.snapshot = { tabs: this.tabs, activeId: this.activeId };
    };
    return this.snapshot;
  };

  constructor() {
    this.open({
      id: "1",
      title: "components",
      path: "D:/ai2all/src/components",
    });
    this.open({
      id: "2",
      title: "Downloads",
      path: "D:/ai2all/Downloads",
    })
  }

  open(tab: Omit<Tab, "active">) {
    // this.tabs.forEach((t) => (t.active = false));
    this.tabs = this.tabs.map((t) => ({...t, active: false }));

    const newTab: Tab = { ...tab, active: true };
    // this.tabs.push(newTab);
    this.tabs = [...this.tabs, newTab];
    this.activeId = newTab.id;
    this.notify();
  };

  close(id: string) {
    const idx = this.tabs.findIndex((t) => t.id === id);
    if (idx === -1) return;

    const wasActive = this.tabs[idx].active;
    // this.tabs.splice(idx, 1);
    this.tabs = [
      ...this.tabs.slice(0,idx),
      ...this.tabs.slice(idx + 1),
    ];

    if (wasActive && this.tabs.length > 0) {
      // const next = this.tabs[idx] ?? this.tabs[idx - 1];
      const nextIdx = idx < this.tabs.length ? idx : idx - 1;
      this.tabs = this.tabs.map((t, i) =>
      i === nextIdx ? { ...t, active: true } : t
      );
      this.activeId = this.tabs[nextIdx].id;
      // next.active = true;
      // this.activeId = next.id;
    };

    if (this.tabs.length === 0) {
      this.activeId = null;
    };

    this.notify();
  };

  setActive(id: string) {
    // this.tabs.forEach((t) => (t.active = t.id === id));
    this.tabs = this.tabs.map((t) => ({ ...t, active: t.id === id }));
    this.activeId = id;
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