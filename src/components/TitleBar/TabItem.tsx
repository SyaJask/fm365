// TabItem.tsx
// 用途: 作为选项卡的单个选项卡组件, 显示选项卡的标题和关闭按钮;
import "./TabItem.css";
import type { Tab } from "../../types";
import { tabStore } from "../../stores/tabStore";

interface TabItemProps {
    tab: Tab;
};

export const TabItem = ({ tab }: TabItemProps) => {
  return (
    <div className={`tab ${tab.active ? "active" : ""}`} onClick={() => tabStore.setActive(tab.id)}>
      <span className="tab-icon">📁</span>
      <span className="tab-title">{tab.title}</span>
      <button className="tab-close" onClick={(e) => {
        e.stopPropagation();
        tabStore.close(tab.id);
      }}>
        ×
      </button>
    </div>
  );
};