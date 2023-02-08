import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { add_setting_header } from "settings/SettingsComponents";
import { MediaDimensionsHandler } from "./handlers/media/MediaDimensionsHandler";
import { MediaToggleHandler } from "./handlers/media/MediaToggleHandler";
import { InlineToggleHandler } from "./handlers/InlineToggleHandler";
import { OptionSourceDropdownHandler } from "./handlers/selects/OptionSourceDropdownHandler";
import { AddOptionHandler } from "./handlers/selects/AddOptionHandler";
import { ManualColumnOptionsHandler } from "./handlers/selects/ManualColumnOptionsHandler";
import { HideCompletedTaskToggleHandler } from "./handlers/tasks/HideCompletedTaskToggleHandler";
import { LinkAliasToggleHandler } from "./handlers/media/LinkAliasToggleHandler";
import { FormulaInputHandler } from "./handlers/automations/FormulaInputHandler";
import { AlignmentXSelectorHandler } from "./handlers/styles/AlignmentXSelectorHandler";
import { AlignmentYSelectorHandler } from "./handlers/styles/AlignmentYSelectorHandler";
import { ToggleWrapContentHandler } from "./handlers/styles/ToggleWrapContentHandler";
import { ColumnIdInputHandler } from "./handlers/ColumnIdInputHandler";
import { DatabaseSelectorHandler } from "./handlers/dropdowns/DatabaseSelectorHandler";
import { RollupAsociatedRelationHandler } from "./handlers/rollups/RollupAsociatedRelationHandler";
import { RollupActionHandler } from "./handlers/rollups/RollupActionHandler";
import { RollupKeyHandler } from "./handlers/rollups/RollupKeyHandler";
import { RollupPersistToggleHandler } from "./handlers/rollups/RollupPersistToggleHandler";
import { RollupFormulaHandler } from "./handlers/rollups/RollupFormulaHandler";
import { BidirectionalRelationToggleHandler } from "./handlers/relations/BidirectionalRelationToggleHandler";
import { RelationColorSelectorHandler } from "./handlers/relations/RelationColorSelectorHandler";
import { FormulaColumnOptionsHandler } from "./handlers/selects/FormulaColumnOptionsHandler";
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
                particularHandlers.push(new AlignmentXSelectorHandler());
                particularHandlers.push(new AlignmentYSelectorHandler());
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
                particularHandlers.push(new OptionSourceDropdownHandler());
                particularHandlers.push(new AddOptionHandler());
                particularHandlers.push(new ManualColumnOptionsHandler());
                particularHandlers.push(new FormulaColumnOptionsHandler());
                break;
            case InputType.TASK:
                particularHandlers.push(new HideCompletedTaskToggleHandler());
                break;
            case InputType.FORMULA:
                particularHandlers.push(new FormulaInputHandler());
                break;
            case InputType.RELATION:
                particularHandlers.push(new DatabaseSelectorHandler());
                particularHandlers.push(new BidirectionalRelationToggleHandler());
                particularHandlers.push(new RelationColorSelectorHandler());
                break;
            case InputType.ROLLUP:
                particularHandlers.push(new RollupAsociatedRelationHandler());
                particularHandlers.push(new RollupActionHandler())
                particularHandlers.push(new RollupKeyHandler());
                particularHandlers.push(new RollupFormulaHandler());
                particularHandlers.push(new RollupPersistToggleHandler());
                break;
            default:
                break;
        }
        return particularHandlers;
    }
}
export const particular_settings_section = new ParticularSetttingsSection();