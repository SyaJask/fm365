// NavigationButtons.tsx
// 用途: 导航栏按钮组件, 包含前进、后退、刷新等功能;
import './NavigationButtons.css';
import { useTabStore, tabStore } from '../../stores';

export const NavigationButtons = () => {
  const { activeId, canGoBack, canGoForward } = useTabStore();
  console.log("NavButtons render");

  return (
    <div className="nav-buttons">
      <button
        className="nav-btn"
        title="后退"
        disabled={!canGoBack}
        onClick={() => activeId && tabStore.goBack(activeId)}
    >
        ←
      </button>
      <button
        className="nav-btn"
        title="前进"
        disabled={!canGoForward}
        onClick={() => activeId && tabStore.goForward(activeId)}
      >
        →
      </button>
      <button
        className="nav-btn"
        title="上翻(Alt + 向上键)"
        onClick={() => activeId && tabStore.goUp(activeId)}
      >
        ↑
      </button>
      <button
        className="nav-btn"
        title="刷新(F5)"
        onClick={() => {
          //mock 数据实际操作, 强制触发一次渲染
        }}>
        ↻
      </button>
    </div>
  );
};