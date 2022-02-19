import {
    Models
}from 'cdm/folder';

import {
    Schema
} from 'services/Base';

test('Configuration init', () => {
    
    // Generate models test
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
    const schema = new Schema(models);

    expect(schema.models.test.params.test.optional).toBe(true);
});