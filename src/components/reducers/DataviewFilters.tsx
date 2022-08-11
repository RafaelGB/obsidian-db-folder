import { Button, ButtonGroup } from "@mui/material";
import { Table } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import FilterOnIcon from "components/img/FilterOnIcon";
import MenuDownIcon from "components/img/MenuDownIcon";
import PlusIcon from "components/img/Plus";
import React from "react";

export default function DataviewFilters(props: { table: Table<RowDataType> }) {
  const { table } = props;
  const { view, tableState } = table.options.meta;
  return (
    <ButtonGroup variant="text" size="small">
      <Button size="small">
        <span className="svg-icon svg-gray" style={{ marginRight: 8 }}>
          <PlusIcon />
        </span>
      </Button>
      <Button size="small">
        <span className="svg-icon svg-gray" style={{ marginRight: 8 }}>
          <FilterOnIcon />
        </span>
      </Button>
      <Button size="small">
        <span className="svg-icon svg-gray" style={{ marginRight: 8 }}>
          <MenuDownIcon />
        </span>
      </Button>
    </ButtonGroup>
  );
}
