import { DatabaseColumn } from "cdm/DatabaseModel";
import { DiskHandlerResponse } from "cdm/MashallModel";
import { DataTypes, YAML_INDENT } from "helpers/Constants";
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
                .filter(key => typeof column[key] !== 'object')
                .forEach(key => {
                    // Lvl3: literal column properties
                    this.localDisk.push(`${YAML_INDENT.repeat(2)}${key}: ${column[key]}`);
                });

            this.localDisk.push(...unmarshallParticularInputInfo(column));
            this.localDisk.push(`${YAML_INDENT.repeat(2)}config:`);

            // Lvl4: column config
            Object.keys(column.config).forEach(key => {
                this.localDisk.push(`${YAML_INDENT.repeat(3)}${key}: ${column.config[key]}`);
            });
        };
        return this.goNext(handlerResponse);
    }
}

function unmarshallParticularInputInfo(column: DatabaseColumn): string[] {
    const particularInputString: string[] = [];
    switch (column.input) {
        case DataTypes.SELECT:
        case DataTypes.TAGS:
            // Lvl3: select column properties
            if (column.options && Array.isArray(column.options)) {
                particularInputString.push(`${YAML_INDENT.repeat(2)}options:`);
                column.options.forEach(option => {
                    particularInputString.push(`${YAML_INDENT.repeat(3)}- { label: "${option.label}", backgroundColor: "${option
                        .backgroundColor}"}`);
                });
            }
    }
    return particularInputString;
}
