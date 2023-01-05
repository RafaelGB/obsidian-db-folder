import { DataObject, Literal } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";

/**
 * @description Method to perform a deep merge of two DataObjects
 * @param {Literal} source - The source(s) that will be used to update the @target object
 * @param {Literal} target - The targeted object that needs to be merged with the supplied @sources
 * @return {DataObject} The final merged object
 */
export function deepMerge(source: Literal, target: Literal) {
    const wrappedSource = DataviewService.wrapLiteral(source);
    const wrappedTarget = DataviewService.wrapLiteral(target);
    if (wrappedSource.type !== "object" || wrappedTarget.type !== "object") {
        return wrappedSource.value;
    }

    for (const key in source as DataObject) {
        const sourceValue = DataviewService.wrapLiteral((source as DataObject)[key]);
        if (Object.prototype.hasOwnProperty.call(target, key)) {
            const targetValue = DataviewService.wrapLiteral((target as DataObject)[key]);
            if (sourceValue.type === "object" && targetValue.type === "object") {
                deepMerge(sourceValue.value, targetValue.value);
            } else {
                (target as DataObject)[key] = sourceValue.value;
            }
        } else {
            (target as DataObject)[key] = sourceValue.value;
        }
    }
    return target;
}

/**
 * Create an object in function of the nested key (a.b.c) and the value to set in the last key
 * I.E.:
 * original = {a: {b: {c: "another value",d:"value on same level"}}}
 * nestedKey = "a.b.c"
 * value = "test"
 * expected result = {a: {b: {c: "test",d:"value on same level"}}}}
 * @param nestedKey
 * @param value
 */
export function generateLiteral(nestedKey: string, value: Literal): Literal {
    const keys = nestedKey.split(".");
    const key = keys.shift();
    if (keys.length === 0) {
        return { [key]: value };
    } else {
        return { [key]: generateLiteral(keys.join("."), value) };
    }
}