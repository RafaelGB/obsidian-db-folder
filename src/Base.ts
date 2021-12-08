import { Notice } from "obsidian";

export class TemplaterError extends Error {
    constructor(msg: string, public console_msg?: string) {
        super(msg);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export async function errorWrapper<T>(
    fn: () => Promise<T>,
    msg: string
): Promise<T> {
    try {
        return await fn();
    } catch (e) {
        if (!(e instanceof TemplaterError)) {
            log_error(new TemplaterError(msg, e.message));
        } else {
            log_error(e);
        }
        return null;
    }
}

export function errorWrapperSync<T>(fn: () => T, msg: string): T {
    try {
        return fn();
    } catch (e) {
        log_error(new TemplaterError(msg, e.message));
        return null;
    }
}
/**
 * Log alert when something is updated
 * @param msg 
 */
export function log_update(msg: string): void {
    const notice = new Notice("", 15000);
    // TODO: Find better way for this
    // @ts-ignore
    notice.noticeEl.innerHTML = `<b>Templater update</b>:<br/>${msg}`;
}

/**
 * Log alert when something is wrong
 * @param e 
 */
export function log_error(e: Error | TemplaterError): void {
    const notice = new Notice("", 8000);
    if (e instanceof TemplaterError && e.console_msg) {
        // TODO: Find a better way for this
        // @ts-ignore
        notice.noticeEl.innerHTML = `<b>Templater Error</b>:<br/>${e.message}<br/>Check console for more informations`;
        console.error(`Templater Error:`, e.message, "\n", e.console_msg);
    } else {
        // @ts-ignore
        notice.noticeEl.innerHTML = `<b>Templater Error</b>:<br/>${e.message}`;
    }
}
