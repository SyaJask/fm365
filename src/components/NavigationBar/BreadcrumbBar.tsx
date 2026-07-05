// BreadcrumbBar.tsx
// 用途: 面包屑导航栏组件, 用于显示当前路径和导航到上级目录;
import './BreadcrumbBar.css';
import { useTabStore, tabStore } from '../../stores';

export const BreadcrumbBar = () => {
  const { tabs, activeId } = useTabStore();
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
          <span
            className="breadcrumb-segment"
            onClick={() => activeTab && tabStore.navigateTo(activeTab.id, seg.fullPath)}
          >
            {seg.name}
          </span>
        </span>
      ))}
    </div>
  );
};