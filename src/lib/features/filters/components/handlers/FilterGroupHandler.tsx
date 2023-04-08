import { FiltersModalHandlerResponse } from "@features/filters/model/FiltersModel";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import React from "react";
import { createRoot } from "react-dom/client";
import DataviewFiltersComponent from "./DataviewFiltersComponent";

export class FilterGroupHandler extends AbstractHandlerClass<FiltersModalHandlerResponse> {
  settingTitle: string = "Content alignment selector";
  handle(
    columnHandlerResponse: FiltersModalHandlerResponse
  ): FiltersModalHandlerResponse {
    const { containerEl, filtersModalManager } = columnHandlerResponse;
    const { table, possibleColumns } = filtersModalManager.props;

    createRoot(containerEl.createDiv()).render(
      <DataviewFiltersComponent
        table={table}
        possibleColumns={possibleColumns}
      />
    );
    return this.goNext(columnHandlerResponse);
  }
}
