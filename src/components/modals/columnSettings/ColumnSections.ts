import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { add_setting_header } from "settings/SettingsComponents";
import { MediaDimensionsHandler } from "components/modals/columnSettings/handlers/media/MediaDimensionsHandler";
import { MediaToggleHandler } from "components/modals/columnSettings/handlers/media/MediaToggleHandler";
import { InlineToggleHandler } from "components/modals/columnSettings/handlers/InlineToggleHandler";
import { SelectedColumnOptionsHandler } from "components/modals/columnSettings/handlers/SelectedColumnOptionsHandler";
import { HideCompletedTaskToggleHandler } from "components/modals/columnSettings/handlers/tasks/HideCompletedTaskToggleHandler";
import { LinkAliasToggleHandler } from "components/modals/columnSettings/handlers/media/LinkAliasToggleHandler";
import { FormulaInputHandler } from "components/modals/columnSettings/handlers/automations/FormulaInputHandler";
import { AlignmentSelectorHandler } from "components/modals/columnSettings/handlers/styles/AlignmentSelectorHandler";
import { ToggleWrapContentHandler } from "components/modals/columnSettings/handlers/styles/ToggleWrapContentHandler";
import { ColumnIdInputHandler } from "components/modals/columnSettings/handlers/ColumnIdInputHandler";
import { DatabaseSelectorHandler } from "components/modals/columnSettings/handlers/dropdowns/DatabaseSelectorHandler";
import { RollupAsociatedRelationHandler } from "components/modals/columnSettings/handlers/rollups/RollupAsociatedRelationHandler";
import { RollupActionHandler } from "components/modals/columnSettings/handlers/rollups/RollupActionHandler";
import { RollupKeyHandler } from "components/modals/columnSettings/handlers/rollups/RollupKeyHandler";
import { RollupPersistToggleHandler } from "components/modals/columnSettings/handlers/rollups/RollupPersistToggleHandler";
import { InputType } from "helpers/Constants";
import { AbstractChain } from "patterns/chain/AbstractFactoryChain";
import { AbstractHandler } from "patterns/chain/AbstractHandler";
import { t } from "lang/helpers";


class StyleSetttingsSection extends AbstractChain<ColumnSettingsHandlerResponse> {
    private input: string = InputType.TEXT;
    protected runBefore(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        this.input = columnHandlerResponse.column.input;
        return columnHandlerResponse;
    }
    protected customHandle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const style_section = columnHandlerResponse.containerEl.createDiv("column-section-container-style");
        add_setting_header(
            style_section,
            t("column_settings_modal_section_style_title"),
            "h3"
        );


        columnHandlerResponse.containerEl = style_section;
        return columnHandlerResponse;
    }
    protected getHandlers(): AbstractHandler<ColumnSettingsHandlerResponse>[] {
        const particularHandlers: AbstractHandler<ColumnSettingsHandlerResponse>[] = [];
        switch (this.input) {
            case InputType.TEXT:
            case InputType.NUMBER:
            case InputType.FORMULA:
            case InputType.RELATION:
            case InputType.ROLLUP:
            case InputType.SELECT:
            case InputType.TAGS:
            case InputType.MARKDOWN:
                particularHandlers.push(new AlignmentSelectorHandler());
                particularHandlers.push(new ToggleWrapContentHandler());
                break;
            default:
            // do nothing
        }
        return particularHandlers;
    }
}
export const style_settings_section = new StyleSetttingsSection();

class BehaviorSetttingsSection extends AbstractChain<ColumnSettingsHandlerResponse> {
    private input: string = InputType.TEXT;
    protected runBefore(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        this.input = columnHandlerResponse.column.input;
        return columnHandlerResponse;
    }
    protected customHandle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const behavior_section = columnHandlerResponse.containerEl.createDiv("column-section-container-behavior");
        add_setting_header(behavior_section, t("column_settings_modal_section_behaviour_title"), "h3");
        columnHandlerResponse.containerEl = behavior_section;
        return columnHandlerResponse;
    }
    protected getHandlers(): AbstractHandler<ColumnSettingsHandlerResponse>[] {
        const particularHandlers: AbstractHandler<ColumnSettingsHandlerResponse>[] = [];
        // Mandatory

        // Particular
        switch (this.input) {
            case InputType.RELATION:
                particularHandlers.push(new ColumnIdInputHandler());
                break;
            case InputType.TASK:
            case InputType.MARKDOWN:
            case InputType.METATADA_TIME:
            case InputType.INLINKS:
            case InputType.OUTLINKS:

                // do nothing
                break;
            default:
                particularHandlers.push(new ColumnIdInputHandler());
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
        add_setting_header(
            particular_section,
            t("column_settings_modal_section_type_title", columnHandlerResponse.column.input),
            'h3'
        );
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
                break;
            case InputType.FORMULA:
                particularHandlers.push(new FormulaInputHandler());
                break;
            case InputType.RELATION:
                particularHandlers.push(new DatabaseSelectorHandler());
                break;
            case InputType.ROLLUP:
                particularHandlers.push(new RollupAsociatedRelationHandler());
                particularHandlers.push(new RollupActionHandler())
                particularHandlers.push(new RollupKeyHandler());
                particularHandlers.push(new RollupPersistToggleHandler());
                break;
            default:
                break;
        }
        return particularHandlers;
    }
}
export const particular_settings_section = new ParticularSetttingsSection();