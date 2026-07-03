// SearchBox.tsx
// 用途: 搜索框组件, 用于在文件资源管理器中进行搜索操作;
import './SearchBox.css';

export const SearchBox = () => {
    return (
        <div className="search-box">
            <input type="text" placeholder="搜索" className="search-input" />
        </div>

    )
}