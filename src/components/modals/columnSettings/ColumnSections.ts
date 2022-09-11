import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { add_setting_header } from "settings/SettingsComponents";
import { MediaDimensionsHandler } from "components/modals/columnSettings/handlers/media/MediaDimensionsHandler";
import { MediaToggleHandler } from "components/modals/columnSettings/handlers/media/MediaToggleHandler";
import { InlineToggleHandler } from "components/modals/columnSettings/handlers/InlineToggleHandler";
import { SelectedColumnOptionsHandler } from "components/modals/columnSettings/handlers/SelectedColumnOptionsHandler";
import { HideCompletedTaskToggleHandler } from "components/modals/columnSettings/handlers/tasks/HideCompletedTaskToggleHandler";
import { LinkAliasToggleHandler } from "components/modals/columnSettings/handlers/media/LinkAliasToggleHandler";
import { InputType } from "helpers/Constants";
import { AbstractChain } from "patterns/AbstractFactoryChain";
import { AbstractHandler } from "patterns/AbstractHandler";

class BehaviorSetttingsSection extends AbstractChain<ColumnSettingsHandlerResponse> {
    private input: string = InputType.TEXT;
    protected runBefore(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        this.input = columnHandlerResponse.column.input;
        return columnHandlerResponse;
    }
    protected customHandle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const behavior_section = columnHandlerResponse.containerEl.createDiv("column-section-container-behavior");
        add_setting_header(behavior_section, "Behavior", "h3");
        columnHandlerResponse.containerEl = behavior_section;
        return columnHandlerResponse;
    }
    protected getHandlers(): AbstractHandler<ColumnSettingsHandlerResponse>[] {
        const particularHandlers: AbstractHandler<ColumnSettingsHandlerResponse>[] = [];
        switch (this.input) {
            case InputType.TASK:
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
class ParticularSetttingsSection extends AbstractChain<ColumnSettingsHandlerResponse> {
    private input: string = InputType.TEXT;
    protected runBefore(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        this.input = columnHandlerResponse.column.input;
        return columnHandlerResponse;
    }

    protected customHandle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const particular_section = columnHandlerResponse.containerEl.createDiv("column-section-container-particular");
        // title of the section
        add_setting_header(particular_section, `Particular properties of "${columnHandlerResponse.column.input}" column type`, 'h3');
        columnHandlerResponse.containerEl = particular_section;
        return columnHandlerResponse;
    }
    protected getHandlers(): AbstractHandler<ColumnSettingsHandlerResponse>[] {
        const particularHandlers: AbstractHandler<ColumnSettingsHandlerResponse>[] = [];
        switch (this.input) {
            case InputType.TEXT:
                particularHandlers.push(new LinkAliasToggleHandler());
                particularHandlers.push(new MediaToggleHandler());
                particularHandlers.push(new MediaDimensionsHandler());
                break;
            case InputType.SELECT:
            case InputType.TAGS:
                particularHandlers.push(new SelectedColumnOptionsHandler());
                break;
            case InputType.TASK:
                particularHandlers.push(new HideCompletedTaskToggleHandler());
            default:
                break;
        }
        return particularHandlers;
    }
}
export const particular_settings_section = new ParticularSetttingsSection();