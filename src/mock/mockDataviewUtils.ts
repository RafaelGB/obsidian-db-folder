import { DatabaseView } from "DatabaseView";
import StateManager from "StateManager";

// TODO
export const generateStateManager = (): StateManager => {
    const initialView: DatabaseView = new DatabaseView(
        app.workspace.getMostRecentLeaf(),
        null
    );
    const stateManager = new StateManager(initialView, null, null, null);
    return stateManager;
};