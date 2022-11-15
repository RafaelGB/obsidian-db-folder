import { DateTime } from "luxon";
import { Notice } from "obsidian";
import { DEFAULT_SETTINGS } from "helpers/Constants";

export function parseLuxonDatetimeToString(datetime: DateTime, format = DEFAULT_SETTINGS.local_settings.datetime_format) {
    let result: string = null;
    try {
        result = DateTime.isDateTime(datetime)
            ? datetime.toFormat(format) : null;
    } catch (e) {
        new Notice(`Error parsing datetime to string: ${e}\ndefault format is applied "${DEFAULT_SETTINGS.local_settings.datetime_format}"`, 3000);
    }
    return result;
}

export function parseLuxonDateToString(datetime: DateTime, format = DEFAULT_SETTINGS.local_settings.date_format) {
    let result: string = null;
    try {
        result = DateTime.isDateTime(datetime)
            ? datetime.toFormat(format) : null;
    } catch (e) {
        new Notice(`Error parsing datetime to string: ${e}\ndefault format is applied "${DEFAULT_SETTINGS.local_settings.date_format}"`, 3000);
    }
    return result;
}

export function parseStringToLuxonDatetime(datetime: string, format = DEFAULT_SETTINGS.local_settings.datetime_format) {
    let result: DateTime = null;
    try {
        result = DateTime.fromFormat(datetime, format);
    } catch (e) {
        new Notice(`Error parsing string to datetime: ${e}\ndefault format is applied "${DEFAULT_SETTINGS.local_settings.datetime_format}"`, 3000);
    }
    return result;
}

export function parseStringToLuxonDate(datetime: string, format = DEFAULT_SETTINGS.local_settings.date_format) {
    let result: DateTime = null;
    try {
        result = DateTime.fromFormat(datetime, format);
    } catch (e) {
        new Notice(`Error parsing string to datetime: ${e}\ndefault format is applied "${DEFAULT_SETTINGS.local_settings.date_format}"`, 3000);
    }
    return result;
}