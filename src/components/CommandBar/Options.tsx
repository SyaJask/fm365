// Options.tsx
// 用途: ;
import { useState } from "react";

type SortBy = "name" | "date" | "type" | "size";

const options: { value: SortBy; label: string }[] = [
  { value: "name", label: "名称" },
  { value: "date", label: "修改日期" },
  { value: "type", label: "类型" },
  { value: "size", label: "大小" },
];

// 新建操作下拉内容, 嵌入 Dropdown 使用;
export const NewOptions = () => {
  return (
    <>
      <button className="dropdown-item">新建文件夹</button>
      <button className="dropdown-item">新建文本文档</button>
      <button className="dropdown-item">新建 Markdown</button>
    </>
  );
};

// 排序方式下拉内容, 嵌入 Dropdown 使用;
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

// 更多操作下拉内容, 嵌入 Dropdown 使用;
export const MoreOptions = () => {
  return (
    <>
      <button className="dropdown-item">全选</button>
      <button className="dropdown-item">反转选择</button>
      <button className="dropdown-item">全不选</button>
      <div className="dropdown-sep" />
      <button className="dropdown-item">映射网络驱动器</button>
      <button className="dropdown-item">断开网络驱动器</button>
      <div className="dropdown-sep" />
      <button className="dropdown-item">文件夹选项</button>
    </>
  );
};
