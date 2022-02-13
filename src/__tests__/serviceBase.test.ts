import {  
    Config
  } from 'services/Base';
test('Configuration init', () => {
    const input = {
        models: [
            {
                label: 'test',
                path: 'test',
                params: [
                    {
                        input: 'test',
                        optional: true
                    }
                ]
            }
        ]
    };
    const config = new Config(input);
    expect(config.settings.models[0].label).toBe('test');
});