// utils/icon.ts
// 用途: 根据文件扩展名返回对应的图标

const extIconMap: Record<string, string> = {
  ".tsx": "⚛️",
  ".ts": "🔷",
  ".js": "🟨",
  ".jsx": "⚛️",
  ".json": "📋",
  ".md": "📝",
  ".html": "🌐",
  ".css": "🎨",
  ".svg": "🖼️",
  ".png": "🖼️",
  ".jpg": "🖼️",
  ".jpeg": "🖼️",
  ".gif": "🖼️",
  ".pdf": "📕",
  ".txt": "📃",
  ".gitignore": "⚙️",
  ".lock": "🔒",
};

export function getFileIcon(name: string, type: "folder" | "file"): string {
  if (type === "folder") return "📁";

  const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
  return extIconMap[ext.toLowerCase()] ?? "📄";
}
