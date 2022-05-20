import { DiskHandlerResponse } from "cdm/MashallModel";
import { YAML_INDENT } from "helpers/Constants";
import { AbstractDiskHandler } from "parsers/handlers/unmarshall/AbstractDiskPropertyHandler";

export class UnmarshallColumnsHandler extends AbstractDiskHandler {
    handlerName: string = 'columns';

    public handle(handlerResponse: DiskHandlerResponse): DiskHandlerResponse {
        const { columns } = handlerResponse.yaml;
        // Lvl1: columns field group
        this.localDisk.push(`${this.handlerName}:`);
        for (const columnKey in columns) {
            const column = columns[columnKey];
            // Skip those columns that are we dont want to
            if (column.skipPersist) continue;
            // Lvl2: column key
            this.localDisk.push(`${YAML_INDENT.repeat(1)}${columnKey
                }:`);
            Object.keys(column)
                .filter(key => key !== 'config')
                .forEach(key => {
                    // Lvl3: column properties
                    this.localDisk.push(`${YAML_INDENT.repeat(2)}${key}: ${column[key]}`);
                });
            this.localDisk.push(`${YAML_INDENT.repeat(2)}config:`);

            // Skip those columns that are metadata. They dont have config
            if (column.isMetadata) continue;
            // Lvl4: column config
            Object.keys(column.config).forEach(key => {
                this.localDisk.push(`${YAML_INDENT.repeat(3)}${key}: ${column.config[key]}`);
            });
        };
        return this.goNext(handlerResponse);
    }
}
