import { Platform } from "obsidian";

/**
 * 
 * @param containerEl 
 */
export function applyPluginModalStyle(containerEl: HTMLElement) {
    if (Platform.isDesktop) {
        containerEl.parentElement.style.width = "80%";
    }
}