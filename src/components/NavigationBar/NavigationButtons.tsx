// NavigationButtons.tsx
// 用途: 导航栏按钮组件, 包含前进、后退、刷新等功能;
import './NavigationButtons.css';

export const NavigationButtons = () => {
    return (
        <div className="nav-buttons">
            <button className="nav-btn" title="后退">
                ←
            </button>
            <button className="nav-btn" title="前进">
                →
            </button>
            <button className="nav-btn" title="上翻">
                ↑
            </button>
            <button className="nav-btn" title="刷新">
                ↻
            </button>
        </div>
    );
};