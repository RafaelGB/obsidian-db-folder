import { add_setting_header } from 'settings/SettingsComponents';
import { SettingHandlerResponse } from 'settings/handlers/AbstractSettingHandler';
import { CSVHeaderFileKeyHandler } from 'settings/handlers/csv/CSVHeaderFileKeyHandler';
import { AbstractChain } from 'patterns/chain/AbstractFactoryChain';
import { AbstractHandler } from 'patterns/chain/AbstractHandler';


/**
 * developer settings section
 */
class CSVSetttingsSection extends AbstractChain<SettingHandlerResponse> {
    protected customHandle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const developer_section = settingHandlerResponse.containerEl.createDiv("configuration-section-container-csv");
        // title of the section
        add_setting_header(developer_section, "CSV section", 'h3');
        settingHandlerResponse.containerEl = developer_section;
        return settingHandlerResponse;
    }
    protected getHandlers(): AbstractHandler<SettingHandlerResponse>[] {
        return [
            new CSVHeaderFileKeyHandler()
        ];
    }
}

const csv_settings_section = new CSVSetttingsSection();
export default csv_settings_section;