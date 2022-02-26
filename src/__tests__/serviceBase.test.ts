import {
    Models
}from 'cdm/FolderModel';

import {
    Schema
} from 'services/Base';

test('Schema class test', () => {
    const schema = Schema.getInstance(generateModels());
    // Test avaliableModels function

    expect(schema.avaliableModels()).toEqual(['myTestModel']);
    // Test getModel function
    expect(schema.getModel('myTestModel')).toEqual(
        generateModels()['myTestModel']
    );

    // Test getModel function
    expect(schema.getModelProperty('myTestModel','params.field.input')).toBe('inputTest');
    // Expect error if key contains '.'
    expect(() => schema.getModel('myTestModel.test')).toThrow();
});

/******************
 * CONSTANT OBJECTS
 ******************/

/**
 * Generate models from a constant object
 * @returns {Models}
 */
function generateModels(){
    const models: Models = {
        "myTestModel": {
            "label": "labelTest",
            "path": "pathTest",
            "params": {
                "field": {
                    "input": "inputTest",
                    "optional": true
                }
            }
        }
    }
    return models;
}
