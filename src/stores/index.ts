// stores/index.ts
// ---- 核心 ----
export * from "./fileStore";

// ---- UI 状态 ----
export {
  useViewStore,
  setViewMode,
  setSortMethod,
  setRenaming,
  toggleExpanded,
  expandToPath,
  toggleDetailPane,
} from "./viewStore";

// ---- 选中 ----
export {
  useSelectionStore,
  getSelectedNames,
  selectFile,
  selectFileAt,
  selectAll,
  invertSelection,
  deselectAll,
} from "./selectionStore";

// ---- 剪切板 ----
export {
  useClipboardStore,
  cut,
  copy,
  paste,
} from "./clipboardStore";

// ---- Tab ----
export * from "./tabStore";
