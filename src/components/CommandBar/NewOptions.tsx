// NewOptions.tsx
// 用途: 新建操作下拉内容, 嵌入 Dropdown 使用; 

export const NewOptions = () => {
  return (
    <>
      <button className="dropdown-item">新建文件夹</button>
      <button className="dropdown-item">新建文本文档</button>
      <button className="dropdown-item">新建 Markdown</button>
    </>
  );
};
