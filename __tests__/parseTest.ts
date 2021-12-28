import{
	parseDatabase
}from "../src/database/parse/parse";

import {
	App
} from "obsidian";
describe("Simple expression tests", () => {
    test("Check parse of yaml", () => {
        expect(parseDatabase("title: test", new App())).toEqual({title: "test"});
    });
});