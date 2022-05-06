import { MockProxy, mock, mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { labTest1 } from 'mock/labTest';
import { App, TFile } from 'obsidian';
test('test', () => {
    // const tfileArrayMock: MockProxy<TFile[]> = mock<TFile[]>();
    // tfileArrayMock
    // // @ts-ignore
    // const mockObj: DeepMockProxy<App> = mockDeep<App>();
    // global.app = mockObj;
    // mockObj.vault.getFiles.mockReturnValue(fakeGetFilesResponse);
    // expect(labTest1()).toEqual(fakeGetFilesResponse);
});

const fakeGetFilesResponse: TFile[] = [
    {
        "name": "file1",
        "path": "path1",
        "parent": {
            "name": "folder1",
            "children": [
                {
                    "name": "file2",
                    "path": "path2",
                    "vault": null,
                    "parent": null,
                },
            ],
            "isRoot": () => true,
            "vault": null,
            "path": "path1",
            "parent": null
        },
        "basename": "file1",
        "vault": null,
        "extension": "",
        "stat": null
    },
    {
        "name": "file2",
        "path": "path2",
        "parent": {
            "name": "folder1",
            "children": [
                {
                    "name": "file2",
                    "path": "path2",
                    "vault": null,
                    "parent": null,
                },
            ],
            "isRoot": () => true,
            "vault": null,
            "path": "path1",
            "parent": null
        },
        "basename": "file2",
        "vault": null,
        "extension": "",
        "stat": null
    },
];


