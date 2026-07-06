// TitleBar.tsx
// 用途: 作为窗口的标题栏组件, 包含选项卡条和窗口控制按钮;
import "./TitleBar.css";
import { type Tab } from "../../types";
import { tabStore, useTabStore } from "../../stores";

interface TabProps {
  tab: Tab;
};

const TabItem = ({ tab }: TabProps) => {
  return (
    <div className={`tab ${tab.active ? "active" : ""}`}
      onClick={() => tabStore.setActive(tab.id)}
    >
      <span className="tab-icon">📁</span>
      <span className="tab-title">{tab.title}</span>
      <button className="tab-close" onClick={(e) =>
        { e.stopPropagation(); tabStore.close(tab.id); }}
      >
        ×
      </button>
    </div>
  );
};

export const TitleBar = () => {
  const { tabs } = useTabStore();

  return (
    <header className="title-bar">
      <div className="tab-strip">
        {tabs.map(tab => (<TabItem key={tab.id} tab={tab} />))}
        <button className="tab-add" onClick={() =>
          tabStore.open({ 
            id: crypto.randomUUID(),
            title: "主页",
            path: "D:/",
          })}
        >
          +
        </button>
      </div>
    </header>
  );
};