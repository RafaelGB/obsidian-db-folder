import { DatabaseView } from "views/DatabaseView";
import StateManager from "StateManager";
import { CustomView } from "views/AbstractView";

export const generateStateManager = (): StateManager => {
    const initialView: CustomView = new DatabaseView(
        app.workspace.getMostRecentLeaf(),
        null
    );
    const stateManager = new StateManager(initialView, null, null);
    return stateManager;
};