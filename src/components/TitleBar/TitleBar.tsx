// TitleBar.tsx
// 用途: 作为窗口的标题栏组件，包含选项卡条和窗口控制按钮。
import "./TitleBar.css";
import { TabStrip, WindowControls } from ".";
import type { Tab } from "../../types";

interface TitleBarProps {
  tabs: Tab[];
}

export const TitleBar = ({ tabs }: TitleBarProps) => {
  return (
    <header className="title-bar">
      <TabStrip tabs={tabs} />
      <WindowControls />
    </header>
  )
}