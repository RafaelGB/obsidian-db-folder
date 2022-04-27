import {
    Models,
    FolderModel,
    Group
} from 'cdm/FolderModel';

export class Schema {
    private static instance: Schema;
    models: Models;

    constructor(models: Models) {
        this.models = models === undefined ? {} : models;
    }

    /**
    * Obtain property inside of input group
    */
    getProperty(group: Group, keypath: string) {
        const s = keypath.split('.');
        group = group[s.shift() as keyof Group];
        while (group && s.length) group = group[s.shift()];
        return group;
    }

    addModel(name: string, model: FolderModel) {
        this.models[name] = model;
    }

    /**
     * Obtain model object
     */
    getModel(key: string) {
        // Error handling if key contains '.'
        if (key.indexOf('.') !== -1) {
            throw new Error('Keypath cannot contain "."');
        }
        return this.getProperty(this.models, key);
    }

    /**
     * Obtain property inside of input model
     * @param key 
     * @param property 
     * @returns 
     */
    getModelProperty(key: string, property: string) {
        // Concatenate key and property to obtain full keypath
        const keypath = key + '.' + property;
        return this.getProperty(this.models, keypath);
    }

    /**
     * Obtain list of models available
     */
    avaliableModels() {
        return Object.keys(this.models);
    }

    /**
     * Singleton instance
     * @returns {Schema}
     */
    public static getInstance(models?: Models): Schema {
        if (!Schema.instance) {
            Schema.instance = new Schema(models);
        }
        return Schema.instance;
    }
}