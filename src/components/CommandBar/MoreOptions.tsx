// MoreOptions.tsx
// 用途: 更多操作下拉内容, 嵌入 Dropdown 使用; 

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
