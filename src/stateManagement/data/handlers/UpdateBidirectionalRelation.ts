import { NoteInfoPage } from "cdm/DatabaseModel";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { obtainColumnsFromFolder } from "components/Columns";
import { InputType, UpdateRowOptions } from "helpers/Constants";
import { resolve_tfile } from "helpers/FileManagement";

import { Link, Literal } from "obsidian-dataview";
import NoteContentActionBuilder from "patterns/builders/NoteContentActionBuilder";
import DatabaseInfo from "services/DatabaseInfo";
import { DataviewService } from "services/DataviewService";
import { EditEngineService } from "services/EditEngineService";
import { VaultManagerDB } from "services/FileManagerService";
import NoteInfo from "services/NoteInfo";
import { ParseService } from "services/ParseService";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class UpdateBidirectionalRelation extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { view, implementation } = tableActionResponse;
        implementation.actions.updateBidirectionalRelation = async (
            source: RowDataType,
            column: TableColumn,
            oldPaths: string[],
            newPaths: string[]
        ) => {
            const relationFile = resolve_tfile(column.config.related_note_path);
            const relationConfig = await new DatabaseInfo(relationFile, view.plugin.settings.local_settings).build();
            const relatedColumns = await obtainColumnsFromFolder(relationConfig.yaml.columns);
            const linkOfSource = DataviewService.getDataviewAPI().fileLink(source.__note__.filepath);
            const linksToRemoveRow = oldPaths
                .filter((path) => !newPaths.includes(path))
                .map((path) => DataviewService.getDataviewAPI().fileLink(path));

            // Related rows to remove the source link
            linksToRemoveRow.forEach(async (link) => {
                const page = DataviewService.getDataviewAPI().page(link.path) as NoteInfoPage;
                const relatedRow = new NoteInfo(page).getAllRowDataType()

                const literal = ParseService.parseLiteral(
                    relatedRow[column.key] as Literal,
                    InputType.RELATION,
                    relationConfig.yaml.config,
                    true
                );
                const parsedNoteToLinks = literal ? literal as Link[] : [];
                parsedNoteToLinks.remove(linkOfSource);

                const mdProperty = ParseService.parseLiteral(
                    parsedNoteToLinks,
                    InputType.MARKDOWN,
                    relationConfig.yaml.config,
                    true
                )
                const file = resolve_tfile(link.path);
                await EditEngineService.updateRowFileProxy(file, column.key, mdProperty, relatedColumns, relationConfig.yaml.config, UpdateRowOptions.COLUMN_VALUE);
            });

            // Related rows to add the source link
            const linksToAddRow = newPaths
                .filter((path) => !oldPaths.includes(path))
                .map((path) => DataviewService.getDataviewAPI().fileLink(path));
            linksToAddRow.forEach(async (link) => {
                const page = DataviewService.getDataviewAPI().page(link.path) as NoteInfoPage;
                const relatedRow = new NoteInfo(page).getAllRowDataType()

                const literal = ParseService.parseLiteral(
                    relatedRow[column.key] as Literal,
                    InputType.RELATION,
                    relationConfig.yaml.config,
                    true
                );
                const parsedNoteToLinks = literal ? literal as Link[] : [];
                parsedNoteToLinks.push(linkOfSource);

                const mdProperty = ParseService.parseLiteral(
                    parsedNoteToLinks,
                    InputType.MARKDOWN,
                    relationConfig.yaml.config,
                    true
                )
                const file = resolve_tfile(link.path);
                await EditEngineService.updateRowFileProxy(file, column.key, mdProperty, relatedColumns, relationConfig.yaml.config, UpdateRowOptions.COLUMN_VALUE);
            });
        };

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);

    }
}