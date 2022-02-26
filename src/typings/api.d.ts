import {
	App
} from 'obsidian';

import {
    FolderModel
} from 'cdm/FolderModel';

import {
    Settings
} from 'Settings';

export interface DbfAPIInterface {
    app: App;
    settings: Settings;

    /** Obtain model using key name */
    obtainFolderModel(key: string): FolderModel;
}