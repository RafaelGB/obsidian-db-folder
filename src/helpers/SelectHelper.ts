import { ColumnOption } from "cdm/ComponentsModel";


export function obtainUniqueOptionValues(arrayOptions: ColumnOption[]): ColumnOption[] {
    const uniqueValues: ColumnOption[] = [];
    // obtain unique values
    arrayOptions.forEach((option) => {
        if (!uniqueValues.some((uniqueOption) => uniqueOption.value === option.value || uniqueOption.label === option.label)) {
            uniqueValues.push(option);
        }
    });
    return uniqueValues;
}