// DetailPane.tsx
// 用途: 右侧详细信息窗格, 显示选中文件的属性和 AI 助手;
import "./DetailPane.css";
import { useTabStore } from "../../stores";

export const DetailPane = () => {
  const { selectedFile } = useTabStore();

  return (
    <div className="detail-pane">
      <div className="detail-section">
        <h3 className="detail-title">详细信息</h3>
        {selectedFile ? (
          <div className="detail-info">
            <p><span className="detail-label">名称:</span>{selectedFile.name}</p>
            <p><span className="detail-label">类型:</span>{selectedFile.type === "folder" ? "文件夹" : selectedFile.ext ?? "文件"}</p>
            {selectedFile.type === "file" && selectedFile.ext && (
              <p><span className="detail-label">扩展名:</span>{selectedFile.ext}</p>
            )}
          </div>
        ) : (
          <p className="detail-hint">选择一个文件以查看其属性</p>
        )
        }
      </div>
      <div className="detail-section">
        <h3 className="detail-title">AI</h3>
        <p className="detail-hint">AI 助手功能即将上线</p>
      </div>
    </div>
  );
};
