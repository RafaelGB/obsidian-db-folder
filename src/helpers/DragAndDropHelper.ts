import { createDragDropManager } from "dnd-core";
import { HTML5Backend } from "react-dnd-html5-backend";

export const DnDTableManager = (
  debugMode: boolean,
  globalContext?: unknown,
  backendOptions?: unknown
) =>
  createDragDropManager(HTML5Backend, globalContext, backendOptions, debugMode);
