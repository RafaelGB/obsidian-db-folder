import { add_setting_header } from 'settings/SettingsComponents';
import { SettingHandlerResponse } from 'settings/handlers/AbstractSettingHandler';
import { AbstractChain } from 'patterns/AbstractFactoryChain';
import { AbstractHandler } from 'patterns/AbstractHandler';
import { RibbonIconToggleHandler } from 'settings/handlers/helpersCommands/RibbonIconToggleHandler';

class HelpersSection extends AbstractChain<SettingHandlerResponse> {
    protected customHandle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const automation_section = settingHandlerResponse.containerEl.createDiv("configuration-section-container-automations");
        // title of the section
        add_setting_header(automation_section, "Helpers/Commands Section", 'h3');
        settingHandlerResponse.containerEl = automation_section;
        return settingHandlerResponse;
    }
    protected getHandlers(): AbstractHandler<SettingHandlerResponse>[] {
        return [
            new RibbonIconToggleHandler()
        ];
    }
}

const helpers_settings_section = new HelpersSection();
export default helpers_settings_section;