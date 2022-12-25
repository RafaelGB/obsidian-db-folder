import { add_setting_header } from 'settings/SettingsComponents';
import { SettingHandlerResponse } from 'settings/handlers/AbstractSettingHandler';
import { LoggerToggleHandler } from 'settings/handlers/developer/LoggerToggleHandler';
import { TableStateToggleHandler } from 'settings/handlers/developer/TableStateToggleHandler';
import { LoggerLevelInfoDropDownHandler } from 'settings/handlers/developer/LoggerLevelInfoDropDownHandler';
import { AbstractChain } from 'patterns/chain/AbstractFactoryChain';
import { AbstractHandler } from 'patterns/chain/AbstractHandler';
import { t } from 'lang/helpers';

/**
 * developer settings section
 */
class DeveloperSetttingsSection extends AbstractChain<SettingHandlerResponse> {
    protected customHandle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const developer_section = settingHandlerResponse.containerEl.createDiv("configuration-section-container-developer");
        // title of the section
        add_setting_header(developer_section, t("settings_developer_section"), 'h3');
        settingHandlerResponse.containerEl = developer_section;
        return settingHandlerResponse;
    }
    protected getHandlers(): AbstractHandler<SettingHandlerResponse>[] {
        return [
            new LoggerToggleHandler(),
            new LoggerLevelInfoDropDownHandler(),
            new TableStateToggleHandler()
        ];
    }
}

const developer_settings_section = new DeveloperSetttingsSection();
export default developer_settings_section;