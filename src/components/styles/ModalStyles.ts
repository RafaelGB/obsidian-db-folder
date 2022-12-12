import { Platform } from "obsidian";

/**
 * Adjust modal style in function of platform
 * @param containerEl 
 */
export function applyPluginModalStyle(containerEl: HTMLElement) {
    if (Platform.isDesktop) {
        containerEl.parentElement.style.width = "80%";
    }
}