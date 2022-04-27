import { Setting } from "obsidian";

/**
 * Component that add a toggle to the settings page.
 * Returns it as a Setting object if you want to modify it.
 * @param container 
 * @param name 
 * @param desc 
 * @param value 
 * @param onChangePromise 
 * @returns {Setting}
 */
export function add_toggle(
    container: HTMLElement,
    name: string,
    desc: string,
    value: boolean,
    onChangePromise: (value: boolean) => Promise<void>
): Setting {
    const toggle = new Setting(container)
        .setName(name)
        .setDesc(desc)
        .addToggle(toggle =>
            toggle
                .setValue(value)
                .onChange(onChangePromise)
        );
    return toggle;
}

/**
 * Component that add a dropdown to the settings page.
 * Returns it as a Setting object if you want to modify it.
 * @param container 
 * @param name 
 * @param desc 
 * @param value 
 * @param options 
 * @param onChangePromise 
 * @returns 
 */
export function add_dropdown(
    container: HTMLElement,
    name: string,
    desc: string,
    value: string,
    options: Record<string, string>,
    onChangePromise: (value: string) => Promise<void>
): Setting {
    const dropdown = new Setting(container)
        .setName(name)
        .setDesc(desc)
        .addDropdown((dropdown) => {
            Object.entries(options).forEach(([key, value]) => {
                dropdown.addOption(key, value);
            });
            dropdown.setValue(value);
            dropdown.onChange(onChangePromise);
        });
    return dropdown;
}
/**
 * Add a header to the settings tab
 */
export function add_setting_header(containerEl: HTMLElement, tittle: string, level: keyof HTMLElementTagNameMap = 'h2'): void {
    containerEl.createEl(level, { text: tittle });
}