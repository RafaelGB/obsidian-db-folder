import { MockProxy, mock, mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { labTest1 } from 'mock/labTest';
import { App } from 'obsidian';
/* tslint:disable */
test('test', () => {
    // @ts-ignore
    const mockObj: DeepMockProxy<App> = mockDeep<App>();
    global.app = mockObj;
    mockObj.vault.getFiles.mockReturnValue([]);
    expect(labTest1()).toEqual([]);
});