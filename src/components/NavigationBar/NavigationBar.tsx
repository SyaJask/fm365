// NavigationBar.tsx
import { useRef, useState } from 'react';
import './NavigationBar.css';
import { tabStore, useTabStore, fileStore } from '../../stores';
import { type Tab } from '../../types';

interface NavigationButtonsProps {
  activeId: string | null;
  canGoBack: boolean;
  canGoForward: boolean;
  canGoUp: boolean;
}

interface BreadcrumbBarProps {
  tabs: Tab[];
  activeId: string | null;
}

interface SearchBoxProps {
  searchQuery: string;
}

// 导航栏按钮组件, 包含前进、后退、刷新等功能;
const NavigationButtons = (
  { activeId, canGoBack, canGoForward, canGoUp }: NavigationButtonsProps
) => {
  const [spinning, setSpinning] = useState(false);

  const handleRefresh = () => {
    if (spinning) return;
    setSpinning(true);
    fileStore.refresh();
    setTimeout(() => setSpinning(false), 400);
  };

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
      <button className="nav-btn" title="上翻(Alt + 向上键)" disabled={!canGoUp}
        onClick={() => activeId && tabStore.goUp(activeId)}
      >
        ↑
      </button>
      {/* TODO: 刷新时应与Windows 界面刷新交互效果类似 */}
      <button className={`nav-btn${spinning ? " spinning" : ""}`} title="刷新(F5)"
        onClick={handleRefresh}
      >
        ↻
      </button>
    </div>
  );
};

// 面包屑导航栏组件, 用于显示当前路径和导航到上级目录;
// TODO: 需要改成类似Windows 的交互模式, 输入框输入路径可以访问对应文件夹;
// 输入cmd 会显示cli
const BreadcrumbBar = ({ tabs, activeId }: BreadcrumbBarProps) => {
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
        <span key={seg.fullPath}>
          {i > 0 && <span className="breadcrumb-sep">›</span>}
          <span
            className={`breadcrumb-segment${i === segments.length - 1 ? " current" : ""}`}
            onClick={i < segments.length - 1 ? () =>
              activeTab && tabStore.navigateTo(activeTab.id, seg.fullPath) : undefined}
          >
            {seg.name}
          </span>
        </span>
      ))}
    </div>
  );
};

// 搜索框组件, 用于在文件资源管理器中进行搜索操作;
const SearchBox = ({ searchQuery }: SearchBoxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="search-box">
      {/* TODO: 应该点击搜索后再展示搜索结果 */}
      <input ref={inputRef} type="text" placeholder="搜索"
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
      <button className="cmd-btn" title="搜索"
        onClick={() => inputRef.current?.focus()}
      >
        🔍
      </button>
    </div>
  );
};

// 导航栏组件, 包含导航按钮和地址栏等功能;
export const NavigationBar = () => {
  const { activeId, canGoBack, canGoForward, canGoUp, tabs, searchQuery } = useTabStore();

  return (
    <div className="navigation-bar">
      <NavigationButtons
        activeId={activeId} canGoBack={canGoBack} canGoForward={canGoForward} canGoUp={canGoUp} />
      <BreadcrumbBar tabs={tabs} activeId={activeId} />
      <SearchBox searchQuery={searchQuery} />
    </div>
  );
};