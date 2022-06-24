import { ColumnHandlerResponse } from "cdm/ModalSettingsModel";
import { add_setting_header } from "settings/SettingsComponents";
import { MediaDimensionsHandler } from "components/modals/handlers/MediaDimensionsHandler";
import { MediaToggleHandler } from "components/modals/handlers/MediaToggleHandler";
import { InlineToggleHandler } from "components/modals/handlers/InlineToggleHandler";
import { ColumnHandler } from "components/modals/handlers/AbstractColumnHandler";
import { SelectedColumnOptionsHandler } from "components/modals/handlers/SelectedColumnOptionsHandler";
import { HideCompletedTaskToggleHandler } from "components/modals/handlers/tasks/HideCompletedTaskToggleHandler";
import { DataTypes } from "helpers/Constants";
import { AbstractChain, AbstractHandler } from "patterns/AbstractFactoryChain";

class BehaviorSetttingsSection extends AbstractChain<ColumnHandlerResponse> {
    protected customHandle(columnHandlerResponse: ColumnHandlerResponse): ColumnHandlerResponse {
        const behavior_section = columnHandlerResponse.containerEl.createDiv("column-section-container-behavior");
        add_setting_header(behavior_section, "Behavior", "h3");
        columnHandlerResponse.containerEl = behavior_section;
        return columnHandlerResponse;
    }
    protected getHandlers(): AbstractHandler<ColumnHandlerResponse>[] {
        return [
            new InlineToggleHandler()
        ]
    }
}
export const behavior_settings_section = new BehaviorSetttingsSection();

/**
 * Every column type has a different behavior section
 */
class ParticularSetttingsSection extends AbstractChain<ColumnHandlerResponse> {
    protected customHandle(columnHandlerResponse: ColumnHandlerResponse): ColumnHandlerResponse {
        const particular_section = columnHandlerResponse.containerEl.createDiv("column-section-container-particular");
        // title of the section
        add_setting_header(particular_section, `Particular properties of "${columnHandlerResponse.column.dataType}" column type`, 'h3');
        columnHandlerResponse.containerEl = particular_section;
        return columnHandlerResponse;
    }
    protected getHandlers(option?: string): AbstractHandler<ColumnHandlerResponse>[] {
        return [
            new InlineToggleHandler()
        ]
    }
}
export const particular_settings_section = new ParticularSetttingsSection();

function addParticularInputSettings(dataType: string): ColumnHandler[] {
    const particularHandlers: ColumnHandler[] = [];
    switch (dataType) {
        case DataTypes.TEXT:
            particularHandlers.push(new MediaToggleHandler());
            particularHandlers.push(new MediaDimensionsHandler());
            break;
        case DataTypes.SELECT:
        case DataTypes.TAGS:
            particularHandlers.push(new SelectedColumnOptionsHandler());
            break;
        case DataTypes.TASK:
            particularHandlers.push(new HideCompletedTaskToggleHandler());
        default:
            break;
    }
    return particularHandlers;
}