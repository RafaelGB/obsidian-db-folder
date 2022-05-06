import { DatabaseView } from "DatabaseView";
import StateManager from "StateManager";

// TODO
export const generateStateManager = (): StateManager => {
    const initialView: DatabaseView = new DatabaseView(
        app.workspace.activeLeaf,
        null
    );
    const stateManager = new StateManager(app, initialView, null, null, null);
    return stateManager;
};