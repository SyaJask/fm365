// ViewSwitcher.tsx
// 用途: 视图切换下拉内容, 嵌入 Dropdown 使用;
import "./ViewSwitcher.css";
import { useViewStore, setViewMode } from "../../stores";

type ViewMode = "list" | "thumbnails" | "details";

const views: { mode: ViewMode; icon: string; label: string }[] = [
  { mode: "list", icon: "☰", label: "列表" },
  { mode: "thumbnails", icon: "⊞", label: "缩略图" },
  { mode: "details", icon: "▤", label: "详细信息" },
];

export const ViewSwitcher = () => {
  const { viewMode } = useViewStore();

  return (
    <>
      {views.map((v) => (
        <button key={v.mode}
          className={`dropdown-item ${viewMode === v.mode ? "active" : ""}`}
          onClick={() => setViewMode(v.mode)}
        >
          <span className="dropdown-item-icon">{v.icon}</span>
          <span>{v.label}</span>
        </button>
      ))}
    </>
  );
};
