// App.tsx
// 用途: ;
import './App.css';
import { useViewStore } from "./stores";
import { TitleBar } from './components/TitleBar';
import { NavigationBar } from './components/NavigationBar';
import { CommandBar } from './components/CommandBar';
import { FolderTree, DetailPane } from './components/FolderTree';
import { FileView } from './components/FileView';
import { StatusBar } from './components/StatusBar';

function App() {
  const { showDetailPane } = useViewStore();

  return (
    <>
      <div className="explorer-window">
        <TitleBar />
        <NavigationBar />
        <CommandBar />
        <div className="main-area">
          <FolderTree />
          <div className="content-area">
            <FileView />
          </div>
          {showDetailPane && <DetailPane />}
        </div>
        <StatusBar />
      </div>
    </>
  );
};

export default App;
