import { FiltersModalHandlerResponse } from "cdm/ModalsModel";
import DataviewFiltersPortal from "components/portals/DataviewFiltersPortal";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
import React from "react";
import { createRoot } from "react-dom/client";

export class FilterGroupHandler extends AbstractHandlerClass<FiltersModalHandlerResponse> {
  settingTitle: string = "Content alignment selector";
  handle(
    columnHandlerResponse: FiltersModalHandlerResponse
  ): FiltersModalHandlerResponse {
    const { containerEl, filtersModalManager } = columnHandlerResponse;
    const { table } = filtersModalManager.props;

    createRoot(containerEl.createDiv()).render(
      <DataviewFiltersPortal table={table} />
    );
    return this.goNext(columnHandlerResponse);
  }
}
