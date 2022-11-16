import { DateTime } from "luxon";
import { DEFAULT_SETTINGS } from "helpers/Constants";
import { LOGGER } from "services/Logger";

export function parseLuxonDatetimeToString(datetime: DateTime, format = DEFAULT_SETTINGS.local_settings.datetime_format) {
    let result: string = null;
    try {
        result = DateTime.isDateTime(datetime)
            ? datetime.toFormat(format) : null;
    } catch (e) {
        LOGGER.error(`Error parsing datetime to string: ${e}\ndefault format is applied "${DEFAULT_SETTINGS.local_settings.datetime_format}"`);
    } finally {
        return result;
    }
}

export function parseLuxonDateToString(datetime: DateTime, format = DEFAULT_SETTINGS.local_settings.date_format) {
    let result: string = null;
    try {
        result = DateTime.isDateTime(datetime)
            ? datetime.toFormat(format) : null;
    } catch (e) {
        LOGGER.error(`Error parsing datetime to string: ${e}\ndefault format is applied "${DEFAULT_SETTINGS.local_settings.date_format}"`);
    } finally {
        return result;
    }
}

export function parseStringToLuxonDatetime(datetime: string, format = DEFAULT_SETTINGS.local_settings.datetime_format) {
    let result: DateTime = null;
    try {
        result = DateTime.fromFormat(datetime, format);
        if (!result.isValid) {
            result = null;
        }
    } catch (e) {
        LOGGER.error(`Error parsing string to datetime: ${e}\ndefault format is applied "${DEFAULT_SETTINGS.local_settings.datetime_format}"`);
    } finally {
        return result;
    }
}

export function parseStringToLuxonDate(datetime: string, format = DEFAULT_SETTINGS.local_settings.date_format) {
    let result: DateTime = null;
    try {
        result = DateTime.fromFormat(datetime, format);
        if (!result.isValid) {
            result = null;
        }
    } catch (e) {
        LOGGER.error(`Error parsing string to datetime: ${e}\ndefault format is applied "${DEFAULT_SETTINGS.local_settings.date_format}"`);
    } finally {
        return result;
    }
}