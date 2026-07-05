// App.tsx
// 用途: ;
import './App.css';
import { TitleBar } from './components/TitleBar';
import { NavigationBar } from './components/NavigationBar';
import { CommandBar } from './components/CommandBar';
import { FolderTree } from './components/FolderTree';
import { FileView } from './components/FileView';
import { DetailPane } from './components/DetailPane';
import { StatusBar } from './components/StatusBar';
import { useTabStore } from './stores';

function App() {
  const { tabs } = useTabStore();
  
  return (
    <>
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
    </>
  );
};

export default App;
