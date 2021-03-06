import { AbstractChain, AbstractHandler } from "patterns/AbstractFactoryChain";
import { SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_setting_header } from "settings/SettingsComponents";
import { TemplateFolderNewRowsHandler } from "settings/handlers/rows/TemplateFolderNewRowsHandler";

class RowsSection extends AbstractChain<SettingHandlerResponse> {
    protected customHandle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const developer_section = settingHandlerResponse.containerEl.createDiv("configuration-section-container-rows");
        // title of the section
        add_setting_header(developer_section, "Rows section", 'h3');
        settingHandlerResponse.containerEl = developer_section;
        return settingHandlerResponse;
    }
    protected getHandlers(): AbstractHandler<SettingHandlerResponse>[] {
        return [
            new TemplateFolderNewRowsHandler()
        ]
    }
}

const rows_settings_section = new RowsSection();
export default rows_settings_section;