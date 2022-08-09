import { add_setting_header } from 'settings/SettingsComponents';
import { SettingHandlerResponse } from 'settings/handlers/AbstractSettingHandler';
import { GroupFolderColumnDropDownHandler } from 'settings/handlers/columns/GroupFolderColumnDropDownHandler';
import { RemoveFieldsWhenDeleteToggleHandler } from 'settings/handlers/columns/RemoveFieldsWhenDeleteToggleHandler';
import { MetadataToggleGroupHandler } from 'settings/handlers/columns/MetadataToggleGroupHandler';
import { TemplateColumnsHandler } from 'settings/handlers/columns/TemplateColumnsHandler';
import { AbstractChain } from 'patterns/AbstractFactoryChain';
import { AbstractHandler } from 'patterns/AbstractHandler';

class ColumnSetttingsSection extends AbstractChain<SettingHandlerResponse> {
    protected customHandle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const columns_section = settingHandlerResponse.containerEl.createDiv("configuration-section-container-columns");
        // title of the section
        add_setting_header(columns_section, "Configuration about columns", 'h3');
        settingHandlerResponse.containerEl = columns_section;
        return settingHandlerResponse;
    }
    protected getHandlers(): AbstractHandler<SettingHandlerResponse>[] {
        return [
            new GroupFolderColumnDropDownHandler(),
            new RemoveFieldsWhenDeleteToggleHandler(),
            new TemplateColumnsHandler(),
            new MetadataToggleGroupHandler(),
        ];
    }
}

const columns_settings_section = new ColumnSetttingsSection();
export default columns_settings_section;