import { AbstractChain, AbstractHandler } from "patterns/AbstractFactoryChain";
import { SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_setting_header } from "settings/SettingsComponents";

class EditingEngineSetttingsSection extends AbstractChain<SettingHandlerResponse> {
    protected customHandle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const developer_section = settingHandlerResponse.containerEl.createDiv("configuration-section-container-editor-engine");
        // title of the section
        add_setting_header(developer_section, "Editor section", 'h3');
        settingHandlerResponse.containerEl = developer_section;
        return settingHandlerResponse;
    }
    protected getHandlers(): AbstractHandler<SettingHandlerResponse>[] {
        throw new Error("Method not implemented.");
    }
}

const editing_engine_settings_section = new EditingEngineSetttingsSection();
export default editing_engine_settings_section;