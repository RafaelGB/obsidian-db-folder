import { add_setting_header } from 'settings/SettingsComponents';
import { SettingHandlerResponse } from 'settings/handlers/AbstractSettingHandler';
import { AbstractChain } from 'patterns/AbstractFactoryChain';
import { AbstractHandler } from 'patterns/AbstractHandler';
import { FormulaJSFolderHandler } from 'settings/handlers/automation/FormulaJSFolderHandler';
import { FormulaJSToggleHandler } from 'settings/handlers/automation/FormulaJSToggleHandler';

class AutomationSetttingsSection extends AbstractChain<SettingHandlerResponse> {
    protected customHandle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const automation_section = settingHandlerResponse.containerEl.createDiv("configuration-section-container-automations");
        // title of the section
        add_setting_header(automation_section, "Automations related to the table", 'h3');
        settingHandlerResponse.containerEl = automation_section;
        return settingHandlerResponse;
    }
    protected getHandlers(): AbstractHandler<SettingHandlerResponse>[] {
        return [
            new FormulaJSToggleHandler(),
            new FormulaJSFolderHandler()
        ];
    }
}

const automation_settings_section = new AutomationSetttingsSection();
export default automation_settings_section;