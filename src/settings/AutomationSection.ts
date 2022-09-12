import { add_setting_header } from 'settings/SettingsComponents';
import { SettingHandlerResponse } from 'settings/handlers/AbstractSettingHandler';
import { AbstractChain } from 'patterns/AbstractFactoryChain';
import { AbstractHandler } from 'patterns/AbstractHandler';
import { FormulaJSFolderHandler } from 'settings/handlers/automation/FormulaJSFolderHandler';

class AutomationSetttingsSection extends AbstractChain<SettingHandlerResponse> {
    protected customHandle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const columns_section = settingHandlerResponse.containerEl.createDiv("configuration-section-container-automations");
        // title of the section
        add_setting_header(columns_section, "Automations related the table", 'h3');
        settingHandlerResponse.containerEl = columns_section;
        return settingHandlerResponse;
    }
    protected getHandlers(): AbstractHandler<SettingHandlerResponse>[] {
        return [
            new FormulaJSFolderHandler()
        ];
    }
}

const automation_settings_section = new AutomationSetttingsSection();
export default automation_settings_section;