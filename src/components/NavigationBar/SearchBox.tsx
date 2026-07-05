// SearchBox.tsx
// 用途: 搜索框组件, 用于在文件资源管理器中进行搜索操作;
import './SearchBox.css';
import { useTabStore, tabStore } from '../../stores';

export const SearchBox = () => {
  const { searchQuery } = useTabStore();

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="搜索"
        className="search-input"
        value={searchQuery}
        onChange={(e) => tabStore.setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button
          className="cmd-btn"
          title="清空"
          onClick={() => tabStore.setSearchQuery("")}
        >
          ✕
        </button>
      )}
        <button className="cmd-btn" title="搜索">
          🔍
        </button>
      </div>
  );
};