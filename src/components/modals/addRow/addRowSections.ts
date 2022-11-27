import { AddRowModalHandlerResponse } from "cdm/ModalsModel";
import { AbstractChain } from "patterns/AbstractFactoryChain";
import { AbstractHandler } from "patterns/AbstractHandler";
import { FilenameTextHandler } from "components/modals/addRow/handlers/FilenameTextHandler";

class AddRowSection extends AbstractChain<AddRowModalHandlerResponse> {

    protected getHandlers(): AbstractHandler<AddRowModalHandlerResponse>[] {
        return [new FilenameTextHandler()];
    }
}
export const add_row_section = new AddRowSection();