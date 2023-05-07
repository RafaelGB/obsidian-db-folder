import { CustomView } from "views/AbstractView";
import { WindowRegistry } from "../model/RegistryModel";
import { unmountComponentAtNode } from 'react-dom';
import { TFile } from "obsidian";
import StateManager from "StateManager";
import { DatabaseSettings } from "cdm/SettingsModel";

class ViewRegistryServiceInstance {

    private static instance: ViewRegistryServiceInstance;
    private windowRegistry: Map<Window, WindowRegistry>;
    private stateManagers: Map<TFile, StateManager>;

    constructor() {
        this.windowRegistry = new Map();
        this.stateManagers = new Map();
    }

    /**
     * Unmount all the registries for all the windows, including the main window
     */
    public unmountAll() {
        this.windowRegistry.forEach((reg, win) => {
            reg.viewStateReceivers.forEach((fn) => fn([]));
            this.unmount(win);
        });
        this.unmount(window);
        this.windowRegistry.clear();
        this.stateManagers.clear();
    }

    /**
     * Add a new view to the registry
     * 
     * @param view The view to add
     * @returns 
     */
    public addView(view: CustomView, settings: DatabaseSettings) {
        const win = view.getWindow();
        const reg = this.windowRegistry.get(win);

        if (!reg) {
            return;
        }
        const file = view.file;
        if (this.stateManagers.has(file)) {
            this.stateManagers.get(file).registerView(view);
        } else {
            this.stateManagers.set(
                file,
                new StateManager(
                    view,
                    () => this.stateManagers.delete(file),
                    () => settings
                )
            );
        }
        reg.viewStateReceivers.forEach((fn) => fn(this.getDatabaseViews(win)));
    }

    /**
     * Remove a view from the registry
     * 
     * @param view The view to remove
     * @returns 
     */
    public removeView(view: CustomView) {
        const entry = Array.from(this.windowRegistry.entries()).find(([, reg]) => {
            return reg.viewMap.has(view.id);
        }, []);

        if (!entry) {
            return;
        }

        const [win, reg] = entry;

        if (reg.viewMap.has(view.id)) {
            reg.viewMap.delete(view.id);
        }
        const file = view.file;

        if (this.stateManagers.has(file)) {
            this.stateManagers.get(file).unregisterView(view);
            reg.viewStateReceivers.forEach((fn) => fn(this.getDatabaseViews(win)));
        }
    }

    /**
     * 
     * @param win 
     * @returns 
     */
    public mount(win: Window) {
        if (this.windowRegistry.has(win)) {
            return;
        }

        const el = win.document.body.createDiv();

        this.windowRegistry.set(win, {
            viewMap: new Map(),
            viewStateReceivers: [],
            appRoot: el,
        });
    }

    /**
     * Unmount the registry for the given window
     * 
     * @param win 
     * @returns 
     */
    public unmount(win: Window) {
        if (!this.windowRegistry.has(win)) {
            return;
        }

        const reg = this.windowRegistry.get(win);

        for (const view of reg.viewMap.values()) {
            view.destroy();
        }

        unmountComponentAtNode(reg.appRoot);

        reg.appRoot.remove();
        reg.viewMap.clear();
        reg.viewStateReceivers.length = 0;
        reg.appRoot = null;

        this.windowRegistry.delete(win);
    }

    /**
     * Obtain the views for the given window
     * 
     * @param win 
     * @returns 
     */
    public getDatabaseViews(win: Window) {
        const reg = this.windowRegistry.get(win);

        if (reg) {
            return Array.from(reg.viewMap.values());
        }

        return [];
    }

    /**
     * Obtain the view for the given window and id
     * 
     * @param id  The id of the view
     * @param win  The window to search
     * @returns 
     */
    public getDatabaseView(id: string, win: Window) {
        const reg = this.windowRegistry.get(win);

        if (reg?.viewMap.has(id)) {
            return reg.viewMap.get(id);
        }

        for (const reg of this.windowRegistry.values()) {
            if (reg.viewMap.has(id)) {
                return reg.viewMap.get(id);
            }
        }

        return null;
    }

    /**
     * Reload all the views that are currently active in the workspace
     * 
     * @param type The type of change
     * @param file The file that changed
     * @param oldPath The old path of the file (only for rename) 
     */
    public reloadActiveViews(type: string, file: TFile, oldPath?: string) {
        const activeView = app.workspace.getActiveViewOfType(CustomView);
        Array.from(this.windowRegistry.entries()).forEach(async ([, { viewMap }]) => {
            // Iterate through all the views and reload the database if the file is the same
            viewMap.forEach(async (view) => {
                const isActive = activeView && (view.file.path === activeView?.file.path);
                view.handleExternalMetadataChange(type, file, isActive, oldPath);
            });
        });
    }

    /**
     * Obtain the state manager for the given file
     * 
     * @param file 
     * @returns 
     */
    public getStateManager(file: TFile) {
        return this.stateManagers.get(file);
    }

    /**
     * Force refresh all the state managers
     */
    public forceRefreshAll() {
        this.stateManagers.forEach((stateManager) => {
            stateManager.forceRefresh();
        });
    }

    public static getInstance(): ViewRegistryServiceInstance {
        if (!this.instance) {
            this.instance = new ViewRegistryServiceInstance();
        }
        return this.instance;
    }
}

export const ViewRegistryService = ViewRegistryServiceInstance.getInstance();