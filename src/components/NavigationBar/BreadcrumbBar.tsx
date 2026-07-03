// BreadcrumbBar.tsx
// 用途: 面包屑导航栏组件, 用于显示当前路径和导航到上级目录;
import './BreadcrumbBar.css';

export const BreadcrumbBar = () => {
    return (
        <div className="breadcrumb-bar">
            <span className="breadcrumb-segment">D:</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-segment">ai2all</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-segment">src</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-segment">components</span>
        </div>
    );
};