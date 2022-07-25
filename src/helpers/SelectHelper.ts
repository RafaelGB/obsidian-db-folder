import { OptionSelect } from "cdm/DatabaseModel";

export function obtainUniqueOptionValues(arrayOptions: OptionSelect[]): OptionSelect[] {
    const uniqueValues: OptionSelect[] = [];
    // obtain unique values
    arrayOptions.forEach((option: OptionSelect) => {
        if (!uniqueValues.some((uniqueOption: OptionSelect) => uniqueOption.label === option.label)) {
            uniqueValues.push(option);
        }
    });
    return uniqueValues;
}