import { DiskHandlerResponse } from "cdm/MashallModel";
import { AtomicFilter, FilterGroup, FilterGroupCondition } from "cdm/SettingsModel";
import { YAML_INDENT } from "helpers/Constants";
import { AbstractDiskHandler } from "parsers/handlers/unmarshall/AbstractDiskPropertyHandler";

export class UnmarshallFiltersHandler extends AbstractDiskHandler {
    handlerName: string = 'filters';

    public handle(handlerResponse: DiskHandlerResponse): DiskHandlerResponse {
        const { filters } = handlerResponse.yaml;
        let indentLevel = 1;
        // Lvl1: filters
        this.localDisk.push(`${this.handlerName}:`);
        this.localDisk.push(`${YAML_INDENT.repeat(indentLevel)}enabled: ${filters.enabled}`);
        this.localDisk.push(`${YAML_INDENT.repeat(indentLevel)}conditions:`);
        indentLevel++;
        if (filters.conditions) {
            for (const condition of filters.conditions) {
                // Array of filters
                this.striginifyFilter(condition, indentLevel + 1);
            }
        }

        return this.goNext(handlerResponse);
    }
    striginifyFilter(filter: FilterGroup, indentLevel: number, isList = false): void {
        if ((filter as FilterGroupCondition).condition) {
            // Is a filter group
            this.localDisk.push(`${YAML_INDENT.repeat(indentLevel)}- condition: ${(filter as FilterGroupCondition).condition}`);
            this.localDisk.push(`${YAML_INDENT.repeat(indentLevel)}- disabled: ${Boolean((filter as FilterGroupCondition).disabled)}`);
            this.localDisk.push(`${YAML_INDENT.repeat(indentLevel)}  filters:`);
            indentLevel++;
            for (const group of (filter as FilterGroupCondition).filters) {
                this.striginifyFilter(group, indentLevel, true);
            }
        } else {
            // Is a simple filter
            this.localDisk.push(`${YAML_INDENT.repeat(indentLevel)}- field: ${(filter as AtomicFilter).field}`);
            this.localDisk.push(`${YAML_INDENT.repeat(indentLevel)}  operator: ${(filter as AtomicFilter).operator}`);
            this.localDisk.push(`${YAML_INDENT.repeat(indentLevel)}  value: ${(filter as AtomicFilter).value}`);
        }
    }
}
