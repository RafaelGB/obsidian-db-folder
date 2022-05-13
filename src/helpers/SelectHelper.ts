import { OptionSelect } from "cdm/DatabaseModel";

export function obtainUniqueOptionValues(arrayOptions: OptionSelect[]): OptionSelect[] {
    const uniqueValues: OptionSelect[] = [];
    arrayOptions.forEach(option => {
        if (!uniqueValues.some(unique => unique.label === option.label)) {
            uniqueValues.push(option);
        }
    });
    return uniqueValues;
}