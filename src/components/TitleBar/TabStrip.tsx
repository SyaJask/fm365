// TabStrip.tsx
// 用途: 作为选项卡条的组件，显示多个选项卡，并允许用户切换和关闭选项卡。
import "./TabStrip.css";
import type { Tab } from "../../types";
import { TabItem } from ".";

interface TabStripProps {
    tabs: Tab[];
}

export const  TabStrip = ({ tabs }: TabStripProps) => {
  return (
    <div className="tab-strip">
      {tabs.map(tab => (
        <TabItem key={tab.id} tab={tab}
        />
      ))}
      <button className="tab-add">
        +
      </button>
    </div>
  )
}