import { Setting } from "obsidian";

/**
 * Setting that add a toggle to the settings page. Returns it as a Setting object if you want to modify it.
 * @param container 
 * @param name 
 * @param desc 
 * @param value 
 * @param onChangePromise 
 * @returns {Setting}
 */
export function add_toggle(container: HTMLElement,name: string, desc: string, value: boolean, onChangePromise: (value: boolean) => Promise<void>): Setting {
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
 * Add a header to the settings tab
 */
export function add_setting_header(containerEl: HTMLElement,tittle: string,level: keyof HTMLElementTagNameMap = 'h2'): void{
    containerEl.createEl(level, {text: tittle});
}