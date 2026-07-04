// SortOptions.tsx
// 用途: 排序方式下拉内容, 嵌入 Dropdown 使用; 
import { useState } from "react";

type SortBy = "name" | "date" | "type" | "size";

const options: { value: SortBy; label: string }[] = [
  { value: "name", label: "名称" },
  { value: "date", label: "修改日期" },
  { value: "type", label: "类型" },
  { value: "size", label: "大小" },
];

export const SortOptions = () => {
  const [selected, setSelected] = useState<SortBy>("name");

  return (
    <>
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`dropdown-item ${selected === opt.value ? "active" : ""}`}
          onClick={() => setSelected(opt.value)}
        >
          {opt.label}
        </button>
      ))}
      <div className="dropdown-sep" />
      <button className="dropdown-item">递增</button>
      <button className="dropdown-item">递减</button>
    </>
  );
};
