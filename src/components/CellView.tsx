import { ItemView, WorkspaceLeaf,MarkdownRenderer } from "obsidian";
import * as React from "react";
import { Cell, CellPropGetter, ColumnInstance, Row, TableCellProps} from 'react-table';
export default class CellView extends ItemView implements Cell{
    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType(): string {
        throw new Error("Method not implemented.");
    }
    getDisplayText(): string {
        throw new Error("Method not implemented.");
    }
    // TODO da un error de que esto no lo coge como función...
    public async markdownRender(type: string, userProps?: object){
        const cellDiv = this.contentEl.createDiv(type);
        await MarkdownRenderer.renderMarkdown(
            this.value,
            cellDiv,
            "readme.md",
            null
        );
        return this.render(type,userProps);
    }

    column: ColumnInstance<{}>;
    row: Row<{}>;
    value: any;
    getCellProps: (propGetter?: CellPropGetter<{}>) => TableCellProps;
    render: (type: string, userProps?: object) => React.ReactNode;
    isRowSpanned: boolean;
    rowSpan: any;
}