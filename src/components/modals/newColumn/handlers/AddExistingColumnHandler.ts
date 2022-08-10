import { AddColumnModalHandlerResponse } from "cdm/ModalsModel";
import { Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/AbstractHandler";

export class AddExistingColumnHandler extends AbstractHandlerClass<AddColumnModalHandlerResponse> {
    settingTitle: string = 'Add existing column';
    handle(response: AddColumnModalHandlerResponse): AddColumnModalHandlerResponse {
        const { containerEl, addColumnModalManager } = response;


        return this.goNext(response);
    }
}