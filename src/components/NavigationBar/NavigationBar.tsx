// NavigationBar.tsx
import './NavigationBar.css';
import { tabStore, useTabStore } from '../../stores';
import { type Tab } from '../../types'

interface NavButtonsProps {
  activeId: string | null;
  canGoBack: boolean;
  canGoForward: boolean;
}

interface BreBarProps {
  tabs: Tab[];
  activeId: string | null;
}

interface SeaBoxProps {
  searchQuery: string;
}

// 导航栏按钮组件, 包含前进、后退、刷新等功能;
const NavButtons = (
  { activeId, canGoBack, canGoForward }: NavButtonsProps
) => {
  return (
    <div className="nav-buttons">
      <button className="nav-btn" title="后退" disabled={!canGoBack}
        onClick={() => activeId && tabStore.goBack(activeId)}
      >
        ←
      </button>
      <button className="nav-btn" title="前进" disabled={!canGoForward}
        onClick={() => activeId && tabStore.goForward(activeId)}
      >
        →
      </button>
      <button className="nav-btn" title="上翻(Alt + 向上键)"
        onClick={() => activeId && tabStore.goUp(activeId)}
      >
        ↑
      </button>
      <button className="nav-btn" title="刷新(F5)"
        onClick={() => { /* mock 数据实际操作, 强制触发一次渲染 */}}
      >
        ↻
      </button>
    </div>
  );
};

// 面包屑导航栏组件, 用于显示当前路径和导航到上级目录;
const BreBar = ({ tabs, activeId }: BreBarProps) => {
  const activeTab = tabs.find((t) => t.id === activeId);
  const path = activeTab?.path ?? "";

  // 拆路径: "D:/ai2all/fm365/src" -> ["D:", "ai2all", "fm365", "src"]
  const segments: { name: string; fullPath: string }[] = [];
  const parts = path.split("/").filter(Boolean);
  for (let i = 0; i < parts.length; i++) {
    segments.push({
      name: parts[i],
      fullPath: parts.slice(0, i + 1).join("/"),
    });
  }

  return (
    <div className="breadcrumb-bar">
      {segments.map((seg, i) => (
        <span key={i}>
          {i > 0 && <span className="breadcrumb-sep">›</span>}
          <span className="breadcrumb-segment" onClick={() =>
            activeTab && tabStore.navigateTo(activeTab.id, seg.fullPath)}
          >
            {seg.name}
          </span>
        </span>
      ))}
    </div>
  );
};

// 搜索框组件, 用于在文件资源管理器中进行搜索操作;
const SeaBox = ({ searchQuery }: SeaBoxProps) => {
  return (
    <div className="search-box">
      <input type="text" placeholder="搜索"
        className="search-input" value={searchQuery}
        onChange={(e) => tabStore.setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button className="cmd-btn" title="清空"
          onClick={() => tabStore.setSearchQuery("")}
        >
          ✕
        </button>
      )}
        <button className="cmd-btn" title="搜索">🔍</button>
      </div>
  );
};

// 导航栏组件, 包含导航按钮和地址栏等功能;
export const NavigationBar = () => {
  const { activeId, canGoBack, canGoForward, tabs, searchQuery } = useTabStore();

  return (
    <div className="navigation-bar">
      <NavButtons
        activeId={activeId} canGoBack={canGoBack} canGoForward={canGoForward} />
      <BreBar tabs={tabs} activeId={activeId} />
      <SeaBox searchQuery={searchQuery} />
    </div>
  );
};