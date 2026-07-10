// fileTree.ts
// 用途: mock 文件树数据 + 按路径查子节点的 helper;

export interface FileNode {
  name: string;
  type: "folder" | "file";
  ext?: string;
  children?: FileNode[];
}

export const root: FileNode = {
  name: "D:",
  type: "folder",
  children: [
    {
      name: "ai2all",
      type: "folder",
      children: [
        {
          name: "Downloads",
          type: "folder",
          children: [
            { name: "photo.png", type: "file", ext: ".png" },
            { name: "doc.pdf", type: "file", ext: ".pdf" },
            { name: "music", type: "folder" },
          ],
        },
        {
          name: "fm365",
          type: "folder",
          children: [
            {
              name: "public",
              type: "folder",
              children: [
                { name: "favicon.svg", type: "file", ext: ".svg" },
              ],
            },
            { name: "index.html", type: "file", ext: ".html" },
            { name: "package.json", type: "file", ext: ".json" },
            { name: "vite.config.ts", type: "file", ext: ".ts" },
            { name: "tsconfig.json", type: "file", ext: ".json" },
            { name: "README.md", type: "file", ext: ".md" },
            { name: ".gitignore", type: "file", ext: "" },
            {
              name: "src",
              type: "folder",
              children: [
                { name: "App.tsx", type: "file", ext: ".tsx" },
                { name: "App.css", type: "file", ext: ".css" },
                { name: "main.tsx", type: "file", ext: ".tsx" },
                { name: "index.css", type: "file", ext: ".css" },
                {
                  name: "components",
                  type: "folder",
                  children: [
                    {
                      name: "CommandBar",
                      type: "folder",
                      children: [
                        { name: "CommandBar.tsx", type: "file", ext: ".tsx" },
                        { name: "CommandBar.css", type: "file", ext: ".css" },
                        { name: "Options.tsx", type: "file", ext: ".tsx" },
                        { name: "Options.css", type: "file", ext: ".css" },
                        { name: "ViewSwitcher.tsx", type: "file", ext: ".tsx" },
                      ],
                    },
                    {
                      name: "TitleBar",
                      type: "folder",
                      children: [
                        { name: "TitleBar.tsx", type: "file", ext: ".tsx" },
                        { name: "TitleBar.css", type: "file", ext: ".css" },
                      ],
                    },
                    {
                      name: "NavigationBar",
                      type: "folder",
                      children: [
                        { name: "NavigationBar.tsx", type: "file", ext: ".tsx" },
                        { name: "NavigationBar.css", type: "file", ext: ".css" },
                      ],
                    },
                    {
                      name: "FileView",
                      type: "folder",
                      children: [
                        { name: "FileView.tsx", type: "file", ext: ".tsx" },
                        { name: "FileView.css", type: "file", ext: ".css" },
                      ],
                    },
                    {
                      name: "FolderTree",
                      type: "folder",
                      children: [
                        { name: "FolderTree.tsx", type: "file", ext: ".tsx" },
                        { name: "FolderTree.css", type: "file", ext: ".css" },
                      ],
                    },
                    {
                      name: "StatusBar",
                      type: "folder",
                      children: [
                        { name: "StatusBar.tsx", type: "file", ext: ".tsx" },
                        { name: "StatusBar.css", type: "file", ext: ".css" },
                      ],
                    },
                  ],
                },
                {
                  name: "stores",
                  type: "folder",
                  children: [
                    { name: "tabStore.ts", type: "file", ext: ".ts" },
                    { name: "fileStore.ts", type: "file", ext: ".ts" },
                    { name: "index.ts", type: "file", ext: ".ts" },
                  ],
                },
                {
                  name: "types",
                  type: "folder",
                  children: [
                    { name: "Tab.ts", type: "file", ext: ".ts" },
                    { name: "index.ts", type: "file", ext: ".ts" },
                  ],
                },
                {
                  name: "data",
                  type: "folder",
                  children: [
                    { name: "fileTree.ts", type: "file", ext: ".ts" },
                  ],
                },
                {
                  name: "utils",
                  type: "folder",
                  children: [
                    { name: "icon.ts", type: "file", ext: ".ts" },
                  ],
                },
              ],
            },
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


