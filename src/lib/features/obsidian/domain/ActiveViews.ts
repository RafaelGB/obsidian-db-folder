import { CustomView } from "views/AbstractView";

export function getActiveCustomView(): CustomView {
    return app.workspace.getActiveViewOfType(CustomView);
}