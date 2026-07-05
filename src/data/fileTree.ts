// fileTree.ts
// 用途: mock 文件树数据 + 按路径查子节点的 helper;

export interface FileNode {
  name: string;
  type: "folder" | "file";
  ext?: string;
  children?: FileNode[];
}

// 全路径→节点 的扁平缓存, 后面加 node 用
let _flatCache: Map<string, FileNode> | null = null;

export const root: FileNode = {
  name: "D:",
  type: "folder",
  children: [
    {
      name: "ai2all",
      type: "folder",
      children: [
        {
          name: "fm365",
          type: "folder",
          children: [
            { name: "src", type: "folder", children: [
              { name: "components", type: "folder", children: [
                { name: "CommandBar", type: "folder" },
              ]},
              { name: "data", type: "folder", children: [
                { name: "fileTree.ts", type: "file", ext: ".ts" },
              ] },
              { name: "App.tsx", type: "file", ext: ".tsx" },
              { name: "main.tsx", type: "file", ext: ".tsx" },
            ]},
            { name: "public", type: "folder" },
          ],
        },
      ],
    },
  ],
};

/**
 * 把形如 "D:/ai2all/fm365/src" 的路径按层拆开,
 * 从 tree 根节点逐层往下找, 返回该路径下的 children (文件/文件夹列表)
 */
export function getFilesByPath(tree: FileNode, rawPath: string): FileNode[] {
  // 去掉末尾斜杆, 再拆
  const path = rawPath.replace(/\/+$/, "");

  // 根节点本身
  if (path === tree.name) {
    return tree.children ?? [];
  };

  // 切掉根节点名 "D:", 剩下的按 / 拆
  const rest = path.startsWith(tree.name + "/")
    ? path.slice(tree.name.length + 1)
    : path;
  
  const segments = rest.split("/").filter(Boolean);

  let current = tree;
  for (const seg of segments) {
    if (!current.children) return [];
    const found = current.children.find(
      (c) => c.name === seg && c.type === "folder"
    );
    if (!found) return [];
    current = found;
  };

  return current.children ?? [];
};

/** 给定路径, 返回该路径对应的节点本身(不是 chilren), 方便判断是否存在 */
export function getNodeByPath(tree: FileNode, rawPath: string): FileNode | null {
  const path = rawPath.replace(/\/+$/, "");
  if (path === tree.name) return tree;

  const rest = path.startsWith(tree.name + "/")
    ? path.slice(tree.name.length + 1)
    : path;

  const segments = rest.split("/").filter(Boolean);
  let current = tree;
  for (const seg of segments) {
    if (!current.children) return null;
    const found = current.children.find(
      (c) => c.name === seg && c.type === "folder"
    );
    if (!found) return null;
    current = found;
  };
  return current;
};


