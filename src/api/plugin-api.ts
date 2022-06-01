import { FolderModel, } from 'cdm/FolderModel';
import { DatabaseSettings } from 'cdm/SettingsModel';
import { App } from 'obsidian';
import { Schema } from 'services/BaseService';
import { DbfAPIInterface } from 'typings/api';

export class DBFolderAPI implements DbfAPIInterface {
    app: App;
    settings: DatabaseSettings;

    public constructor(
        app: App,
        settings: DatabaseSettings
    ) {
        this.app = app;
        this.settings = settings;
    }

    obtainFolderModel(key: string): FolderModel {
        const model: FolderModel = Schema.getInstance().getModel(key);
        return model;
    }
}

