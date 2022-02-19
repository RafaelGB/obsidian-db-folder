import {
	App
} from 'obsidian';

import {
    FolderModel
} from 'cdm/Folder';

import {
    Settings
} from 'Settings';

export interface DbfAPIInterface {
    app: App;
    settings: Settings;

    /** Obtain model using key name */
    obtainFolderModel(key: string): FolderModel;
}