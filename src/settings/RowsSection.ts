import { AbstractChain } from "patterns/AbstractFactoryChain";
import { SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_setting_header } from "settings/SettingsComponents";
import { TemplateFolderNewRowsHandler } from "settings/handlers/rows/TemplateFolderNewRowsHandler";
import { PaginationSizeHandler } from "settings/handlers/rows/PaginationSizeHandler";
import { RowShadowToggleHandler } from "settings/handlers/rows/RowShadowToggleHandler";
import { FooterToggleHandler } from "settings/handlers/rows/FooterToggleHandler";
import { FontSizeHandler } from "settings/handlers/rows/FontSizeHandler";
import { AbstractHandler } from "patterns/AbstractHandler";

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
            new TemplateFolderNewRowsHandler(),
            new PaginationSizeHandler(),
            new FontSizeHandler(),
            new RowShadowToggleHandler(),
            new FooterToggleHandler()
        ]
    }
}

const rows_settings_section = new RowsSection();
export default rows_settings_section;