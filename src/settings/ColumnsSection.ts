import { add_setting_header } from 'settings/SettingsComponents';
import { SettingHandlerResponse } from 'settings/handlers/AbstractSettingHandler';
import { GroupFolderColumnTextInputHandler } from 'settings/handlers/columns/GroupFolderColumnTextInputHandler';
import { RemoveFieldsWhenDeleteToggleHandler } from 'settings/handlers/columns/RemoveFieldsWhenDeleteToggleHandler';
import { DefaultMetadataToggleGroupHandler } from 'settings/handlers/columns/DefaultMetadataToggleGroupHandler';
import { TemplateColumnsHandler } from 'settings/handlers/columns/TemplateColumnsHandler';
import { InlineFieldsOptionsHandler } from 'settings/handlers/columns/InlineFieldsOptionsHandler';
import { AbstractChain } from 'patterns/chain/AbstractFactoryChain';
import { AbstractHandler } from 'patterns/chain/AbstractHandler';
import { t } from 'lang/helpers';

class ColumnSetttingsSection extends AbstractChain<SettingHandlerResponse> {
    protected customHandle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const columns_section = settingHandlerResponse.containerEl.createDiv("configuration-section-container-columns");
        // title of the section
        add_setting_header(columns_section, t("settings_column_section"), 'h3');
        settingHandlerResponse.containerEl = columns_section;
        return settingHandlerResponse;
    }
    protected getHandlers(): AbstractHandler<SettingHandlerResponse>[] {
        return [
            new GroupFolderColumnTextInputHandler(),
            new RemoveFieldsWhenDeleteToggleHandler(),
            new TemplateColumnsHandler(),
            new DefaultMetadataToggleGroupHandler(),
            new InlineFieldsOptionsHandler()
        ];
    }
}

const columns_settings_section = new ColumnSetttingsSection();
export default columns_settings_section;
