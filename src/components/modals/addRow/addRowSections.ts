import { AddRowModalHandlerResponse } from "cdm/ModalsModel";
import { AbstractChain } from "patterns/AbstractFactoryChain";
import { AbstractHandler } from "patterns/AbstractHandler";
import { FilenameTextHandler } from "components/modals/addRow/handlers/FilenameTextHandler";
import { TemplateDropdownHandler } from "components/modals/addRow/handlers/TemplateDropdownHandler";

class AddRowSection extends AbstractChain<AddRowModalHandlerResponse> {

    protected getHandlers(): AbstractHandler<AddRowModalHandlerResponse>[] {
        return [
            new FilenameTextHandler(),
            new TemplateDropdownHandler()
        ];
    }
}
export const add_row_section = new AddRowSection();