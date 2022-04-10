import { Setting } from "obsidian";

/**
 * create toggle in the settings window
 * @param name 
 * @param desc 
 * @param value 
 * @param onChangePromise 
 */
export function add_toggle(container: HTMLElement,name: string, desc: string, value: boolean, onChangePromise: (value: boolean) => Promise<void>): void {
    new Setting(container)
        .setName(name)
        .setDesc(desc)
        .addToggle(toggle =>
            toggle
                .setValue(value)
                .onChange(onChangePromise)
        );

}

/**
 * Add a header to the settings tab
 */
export function add_setting_header(containerEl: HTMLElement,tittle: string,level: keyof HTMLElementTagNameMap = 'h2'): void{
    containerEl.createEl(level, {text: tittle});
}