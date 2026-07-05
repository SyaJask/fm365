// ExplorerWindow.tsx
// 用途: 作为文件资源管理器的窗口组件, 包含标题栏和选项卡等功能;
import './ExplorerWindow.css';
import { TitleBar } from "../TitleBar";
import { NavigationBar } from "../NavigationBar";
import { CommandBar } from "../CommandBar";
import { FolderTree } from '../FolderTree';
import { FileView } from '../FileView';
import { DetailPane } from '../DetailPane';
import { StatusBar } from '../StatusBar';
import { useTabStore } from "../../stores/tabStore";

export const ExplorerWindow = () => {
  const { tabs } = useTabStore();
  
  return (
    <div className="explorer-window">
      <TitleBar tabs={tabs} />
      <NavigationBar />
      <CommandBar />
      <div className="main-area">
        <FolderTree />
        <div className="content-area">
          <FileView />
        </div>
        <DetailPane />
      </div>
      <StatusBar />
    </div>
  );
};