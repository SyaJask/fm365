// Options.tsx
// 用途: ;
import { useState, useRef, useEffect } from "react";
import "./Options.css";
import { useFileStore, fileStore } from "../../stores";

type SortBy = "name" | "date" | "type" | "size";

const options: { value: SortBy; label: string }[] = [
  { value: "name", label: "名称" },
  { value: "date", label: "修改日期" },
  { value: "type", label: "类型" },
  { value: "size", label: "大小" },
];

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title?: string;
}

// 新建操作下拉内容, 嵌入 Dropdown 使用;
export const NewOptions = () => {
  return (
    <>
      <button className="dropdown-item"
        onClick={() => fileStore.createFolder("新建文件夹")}
      >新建文件夹</button>
      <button className="dropdown-item"
        onClick={() => fileStore.createFile("新建文本文档.txt", "txt")}
      >新建文本文档</button>
      <button className="dropdown-item"
        onClick={() => fileStore.createFile("新建文档.md", ".md")}
      >新建 Markdown</button>
    </>
  );
};

// 排序方式下拉内容, 嵌入 Dropdown 使用;
export const SortOptions = () => {
  const { sortBy, sortOrder } = useFileStore();

  return (
    <>
      {options.map((opt) => (
        <button key={opt.value}
          className={`dropdown-item ${sortBy === opt.value ? "active" : ""}`}
          onClick={() => fileStore.setSortMethod(opt.value)}
        >
          {opt.label}
        </button>
      ))}
      <div className="dropdown-sep" />
      <button className={`dropdown-item ${sortOrder === "asc" ? "active" : ""}`}
        onClick={() => fileStore.setSortMethod(sortBy, "asc")}
      >
        递增
      </button>
      <button className={`dropdown-item ${sortOrder === "desc" ? "active" : ""}`}
        onClick={() => fileStore.setSortMethod(sortBy, "desc")}
      >
        递减
      </button>
    </>
  );
};

// 更多操作下拉内容, 嵌入 Dropdown 使用;
export const MoreOptions = () => {
  return (
    <>
      <button className="dropdown-item"
        onClick={() => fileStore.selectAll()}
      >全选</button>
      <button className="dropdown-item"
        onClick={() => fileStore.invertSelection()}
      >反转选择</button>
      <button className="dropdown-item"
        onClick={() => fileStore.deselectAll()}
      >全不选</button>
      <div className="dropdown-sep" />
      <button className="dropdown-item">映射网络驱动器</button>
      <button className="dropdown-item">断开网络驱动器</button>
      <div className="dropdown-sep" />
      <button className="dropdown-item">文件夹选项</button>
    </>
  );
};

// 通用下拉组件, 点击按钮弹出菜单, 点击外部或选项时关闭; 
export const Dropdown = ({ trigger, children, title }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      };
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    };
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="dropdown" ref={ref}>
      <button className="dropdown-trigger"
        title={title} onClick={() => setOpen((v) => !v)}
      >
        {trigger}
      </button>
      {open && (
        <div className="dropdown-menu" onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
};
