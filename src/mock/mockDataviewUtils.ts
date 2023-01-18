import { DatabaseView } from "views/DatabaseView";
import StateManager from "StateManager";

export const generateStateManager = (): StateManager => {
    const initialView: DatabaseView = new DatabaseView(
        app.workspace.getMostRecentLeaf(),
        null
    );
    const stateManager = new StateManager(initialView, null, null);
    return stateManager;
};