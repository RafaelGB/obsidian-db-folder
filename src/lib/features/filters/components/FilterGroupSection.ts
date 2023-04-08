import { AbstractChain } from "patterns/chain/AbstractFactoryChain";
import { AbstractHandler } from "patterns/chain/AbstractHandler";
import { FiltersModalHandlerResponse } from "../model/FiltersModel";
import { FilterGroupHandler } from "./handlers/FilterGroupHandler";
import { AddNewFilterHandler } from "./handlers/AddNewFilterHandler";
class FilterGroupSection extends AbstractChain<FiltersModalHandlerResponse> {
    protected getHandlers(): AbstractHandler<FiltersModalHandlerResponse>[] {
        return [
            new FilterGroupHandler(),
            new AddNewFilterHandler()
        ];
    }
}

export const filter_group_section = new FilterGroupSection();