// stores/tabStore.ts
// 用途: 管理应用程序中的选项卡状态，包括打开、关闭和切换选项卡。
import type { Tab } from "../types/Tab";

class TabStore {
  tabs: Tab[] = [];
  activeId: string | null = null;

  open(tab: Omit<Tab, "active">) {}
  close(id: string) {}
  setActive(id: string) {}
}

export const tabStore = new TabStore();