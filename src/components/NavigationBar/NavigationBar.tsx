// NavigationBar.tsx
// 用途: 导航栏组件, 包含导航按钮和地址栏等功能;
import './NavigationBar.css';
import { NavigationButtons, BreadcrumbBar, SearchBox } from '.';

export const NavigationBar = () => {
    return (
        <div className="navigation-bar">
            <NavigationButtons />
            <BreadcrumbBar />
            <SearchBox />
        </div>
    );
};