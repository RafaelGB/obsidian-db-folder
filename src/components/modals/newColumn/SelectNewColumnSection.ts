import { AddColumnModalHandlerResponse } from "cdm/ModalsModel";
import { AbstractChain } from "patterns/AbstractFactoryChain";
import { AbstractHandler } from "patterns/AbstractHandler";

class SelectNewColumnSection extends AbstractChain<AddColumnModalHandlerResponse> {
    protected getHandlers(): AbstractHandler<AddColumnModalHandlerResponse>[] {
        return [];
    }
}

export const select_new_column_section = new SelectNewColumnSection();