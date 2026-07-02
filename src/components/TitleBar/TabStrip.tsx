// TabStrip.tsx
// 用途: 作为选项卡条的组件，显示多个选项卡，并允许用户切换和关闭选项卡。
import "./TabStrip.css";
import type { Tab } from "../../types";
import { TabItem } from ".";
import { tabStore } from "../../stores/tabStore";

interface TabStripProps {
    tabs: Tab[];
};

export const  TabStrip = ({ tabs }: TabStripProps) => {
  return (
    <div className="tab-strip">
      {tabs.map(tab => (
        <TabItem key={tab.id} tab={tab}
        />
      ))}
      <button
      className="tab-add"
      onClick={() =>
        tabStore.open({
          id: crypto.randomUUID(),
          title: "New Tab",
          path: "D:/",
        })
      }>
        +
      </button>
    </div>
  );
};