// CommandBar.tsx
// 用途: 命令栏容器, 包含操作按钮和视图切换器; 
import "./CommandBar.css";
import { CommandButtons } from ".";

export const CommandBar = () => {
  return (
    <div className="command-bar">
      <CommandButtons />
    </div>
  );
};
