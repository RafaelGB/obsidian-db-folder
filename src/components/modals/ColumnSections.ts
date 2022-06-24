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
    private dataType: string = DataTypes.TEXT;
    protected runBefore(columnHandlerResponse: ColumnHandlerResponse): ColumnHandlerResponse {
        this.dataType = columnHandlerResponse.column.dataType;
        return columnHandlerResponse;
    }
    protected customHandle(columnHandlerResponse: ColumnHandlerResponse): ColumnHandlerResponse {
        const behavior_section = columnHandlerResponse.containerEl.createDiv("column-section-container-behavior");
        add_setting_header(behavior_section, "Behavior", "h3");
        columnHandlerResponse.containerEl = behavior_section;
        return columnHandlerResponse;
    }
    protected getHandlers(): AbstractHandler<ColumnHandlerResponse>[] {
        const particularHandlers: ColumnHandler[] = [];
        switch (this.dataType) {
            case DataTypes.TASK:
                // do nothing
                break;
            default:
                particularHandlers.push(new InlineToggleHandler());
        }
        return particularHandlers;
    }
}
export const behavior_settings_section = new BehaviorSetttingsSection();

/**
 * Every column type has a different behavior section
 */
class ParticularSetttingsSection extends AbstractChain<ColumnHandlerResponse> {
    private dataType: string = DataTypes.TEXT;
    protected runBefore(columnHandlerResponse: ColumnHandlerResponse): ColumnHandlerResponse {
        this.dataType = columnHandlerResponse.column.dataType;
        return columnHandlerResponse;
    }

    protected customHandle(columnHandlerResponse: ColumnHandlerResponse): ColumnHandlerResponse {
        const particular_section = columnHandlerResponse.containerEl.createDiv("column-section-container-particular");
        // title of the section
        add_setting_header(particular_section, `Particular properties of "${columnHandlerResponse.column.dataType}" column type`, 'h3');
        columnHandlerResponse.containerEl = particular_section;
        return columnHandlerResponse;
    }
    protected getHandlers(): AbstractHandler<ColumnHandlerResponse>[] {
        const particularHandlers: ColumnHandler[] = [];
        switch (this.dataType) {
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
}
export const particular_settings_section = new ParticularSetttingsSection();