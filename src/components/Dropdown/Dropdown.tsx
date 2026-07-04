// Dropdown.tsx
// 用途: 通用下拉组件, 点击按钮弹出菜单, 点击外部或选项时关闭; 
import { useState, useRef, useEffect } from "react";
import "./Dropdown.css";

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title?: string;
}

export const Dropdown = ({ trigger, children, title }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickQutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      };
    };
    if (open) {
      document.addEventListener("mousedown", handleClickQutside);
    };
    return () => document.removeEventListener("mousedown", handleClickQutside);
  }, [open]);

  return (
    <div className="dropdown" ref={ref}>
      <button
        className="dropdown-trigger"
        title={title}
        onClick={() => setOpen((v) => !v)}
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
