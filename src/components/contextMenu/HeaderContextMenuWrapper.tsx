import { flexRender, Header } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { c } from "helpers/StylesHelper";
import React from "react";
interface HeaderWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  header: Header<RowDataType, unknown>;
}
const HeaderContextMenuWrapper = ({ header, ...props }: HeaderWrapperProps) => {
  return (
    <div key={`${header.id}`} className={`${c("th")}`} {...props}>
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
    </div>
  );
};

export default HeaderContextMenuWrapper;
