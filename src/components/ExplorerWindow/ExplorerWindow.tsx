// ExplorerWindow.tsx
// 用途: 作为文件资源管理器的窗口组件，包含标题栏和选项卡等功能。
import './ExplorerWindow.css'
import { TitleBar } from "../TitleBar"
import type { Tab } from "../../types"

export const ExplorerWindow = () => {
  const tabs: Tab[] = [
    {
      id: "1",
      title: "components",
      path: "D:/ai2all/src/components",
      active: true,
    },
    {
      id: "2",
      title: "Downloads",
      path: "D:/ai2all/Downloads",
      active: false,
    },
  ]

  return (
    <div className="explorer-window">
      <TitleBar tabs={tabs} />
      {/* <NavigationBar />
      <CommandBar />
      <FileView />
      <StatusBar /> */}
    </div>
  )
}