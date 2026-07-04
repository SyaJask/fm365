// StatusBar.tsx
// 用途: 状态栏, 显示文件数量和选中信息;
import "./StatusBar.css"

export const StatusBar = () => {
  return (
    <div className="status-bar">
      <span className="status-left">7 个项目</span>
      <span className="status-right"></span>
    </div>
  )
}