import {
    Models
}from 'cdm/folder';

import {
    Schema
} from 'services/Base';

test('Schema class test', () => {
    const schema = new Schema(generateModels());
    // Test getKeys function
    expect(schema.getKeys('test.params')).toEqual(['test']);
    // Test getProperty function
    expect(schema.getProperty('test.params.test.input')).toBe('test');
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
        "test": {
            "label": "Test",
            "path": "test",
            "params": {
                "test": {
                    "input": "test",
                    "optional": true
                }
            }
        }
    }
    return models;
}
