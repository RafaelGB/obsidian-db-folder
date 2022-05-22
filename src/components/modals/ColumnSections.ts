import { ColumnHandlerResponse } from "cdm/ModalSettingsModel";
import { add_setting_header } from "settings/SettingsComponents";
import { MediaDimensionsHandler } from "components/modals/handlers/MediaDimensionsHandler";
import { MediaToggleHandler } from "components/modals/handlers/MediaToggleHandler";
import { InlineToggleHandler } from "components/modals/handlers/InlineToggleHandler";
import { ColumnHandler } from "./handlers/AbstractColumnHandler";
import { DataTypes } from "helpers/Constants";
import { SelectedColumnOptionsHandler } from "./handlers/SelectedColumnOptionsHandler";

export function behavior_settings_section(settingHandlerResponse: ColumnHandlerResponse) {
    const behavior_section = settingHandlerResponse.containerEl.createDiv("column-section-container-behavior");
    add_setting_header(behavior_section, "Behavior", "h3");
    /**
     * Obtain all classes than extends from AbstractHandler
     */
    const handlers = [
        new InlineToggleHandler()
    ]
    let i = 1;
    while (i < handlers.length) {
        handlers[i - 1].setNext(handlers[i]);
        i++;
    }

    settingHandlerResponse.containerEl = behavior_section;
    return handlers[0].handle(settingHandlerResponse);
}

export function particular_settings_section(settingHandlerResponse: ColumnHandlerResponse): ColumnHandlerResponse {
    const particular_section = settingHandlerResponse.containerEl.createDiv("column-section-container-particular");
    // title of the section
    add_setting_header(particular_section, `Particular properties of "${settingHandlerResponse.column.dataType
        }" column type`, 'h3');
    /**
     * Obtain all classes than extends from AbstractHandler
     */
    const handlers = [
        ...addParticularInputSettings(settingHandlerResponse.column.dataType)
    ]
    let i = 1;
    while (i < handlers.length) {
        handlers[i - 1].setNext(handlers[i]);
        i++;
    }

    settingHandlerResponse.containerEl = particular_section;
    return handlers[0].handle(settingHandlerResponse);
}

function addParticularInputSettings(dataType: string): ColumnHandler[] {
    const particularHandlers: ColumnHandler[] = [];
    switch (dataType) {
        case DataTypes.TEXT:
            particularHandlers.push(new MediaToggleHandler());
            particularHandlers.push(new MediaDimensionsHandler());
            break;
        case DataTypes.SELECT:
            particularHandlers.push(new SelectedColumnOptionsHandler());
            break;
        default:
            break;
    }
    return particularHandlers;
}