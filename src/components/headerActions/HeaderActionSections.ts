import { HeaderAction, HeaderActionResponse } from "cdm/HeaderActionModel";
import { add_setting_header } from "settings/SettingsComponents";

/**
 * Every column type has a different behavior section
 * @param settingHandlerResponse 
 * @returns 
 */
export function header_buttons_section(settingHandlerResponse: HeaderActionResponse): HeaderActionResponse {
    const handlers = [
        ...addParticularHeaderActions(settingHandlerResponse.column.dataType)
    ]
    if (handlers.length > 0) {
        let i = 1;
        while (i < handlers.length) {
            handlers[i - 1].setNext(handlers[i]);
            i++;
        }
        return handlers[0]?.handle(settingHandlerResponse);
    } else {
        return settingHandlerResponse;
    }
}

function addParticularHeaderActions(dataType: string): HeaderAction[] {
    const particularHandlers: HeaderAction[] = [];
    switch (dataType) {
        default:
            break;
    }
    return particularHandlers;
}