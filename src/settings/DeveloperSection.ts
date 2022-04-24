import { add_setting_header } from 'settings/SettingsComponents';
import { SettingHandler } from 'settings/handlers/AbstractSettingHandler';
import { LoggerToggleHandler } from 'settings/handlers/developer/LoggerToggleHandler';
import { TableStateToggleHandler } from 'settings/handlers/developer/TableStateToggleHandler';
import { SettingsManager } from 'Settings';
import { LoggerLevelInfoDropDownHandler } from 'settings/handlers/developer/LoggerLevelInfoDropDownHandler';
import { DatabaseView } from 'DatabaseView';

/**
 * developer settings section
 */
export function developer_settings_section(
  settingsManager: SettingsManager,
  containerEl: HTMLElement,
  local: boolean
): void {
  // title of the section
  add_setting_header(containerEl, "Developer section", "h3");
  // add soft red background color to the section - TODO: make it configurable
  containerEl.style.backgroundColor = "var(--background-modifier-error)";
  // section settings
  const handlers = getHandlers();
  let i = 1;
  while (i < handlers.length) {
    handlers[i - 1].setNext(handlers[i]);
    i++;
  }
  handlers[0].handle(settingsManager, containerEl, local);
}

/**
 * Obtain all classes than extends from AbstractHandler
 */
 function getHandlers(): SettingHandler[] {
    return [
        new LoggerToggleHandler(),
        new LoggerLevelInfoDropDownHandler(),
        new TableStateToggleHandler()
    ];