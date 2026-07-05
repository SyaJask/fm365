// Tab.ts
// 用途: 定义选项卡的类型;

export interface Tab {
  id: string
  title: string
  path: string
  active: boolean
//   pinned?: boolean
//   loading?: boolean
//   icon?: React.ReactNode
};

export interface TabProps {
  tab: Tab;
};

export interface NavButtonsProps {
  activeId: string | null;
  canGoBack: boolean;
  canGoForward: boolean;
}

export interface BreBarProps {
  tabs: Tab[];
  activeId: string | null;
}

 export interface SeaBoxProps {
  searchQuery: string;
}