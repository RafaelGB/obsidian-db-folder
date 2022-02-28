import { FolderModel, } from 'cdm/FolderModel';
import { App } from 'obsidian';
import { Settings } from 'Settings';
import { Schema } from 'services/BaseService';
import { DbfAPIInterface } from 'typings/api';

export class DBFolderAPI implements DbfAPIInterface {
    app: App;
    settings: Settings;

    public constructor(
        app: App, 
        settings: Settings
    ) {
        this.app = app;
        this.settings = settings;
    }
    
    obtainFolderModel(key: string): FolderModel {
        const model:FolderModel = Schema.getInstance().getModel(key);
        return model;
    }
}

