export interface LogInterface {
    debug(...args: unknown[]): void;
    info(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    error(...args: unknown[]): void;
    setDebugMode(isDebugModeEnabled: boolean): void;
    setLevelInfo(value: string): void;
}

const LevelInfoRecord: Record<string, number> = {
    debug: 3,
    info: 2,
    warn: 1,
    error: 0
};

class Log implements LogInterface {
    private static instance: LogInterface;
    private isDebugModeEnabled: boolean;
    private levelInfo: number;
    public debug: (...args: unknown[]) => void;
    public info: (...args: unknown[]) => void;
    public warn: (...args: unknown[]) => void;
    public error: (...args: unknown[]) => void;

    private constructor() {
        this.isDebugModeEnabled = false;
        this.levelInfo = 0;
    }

    public setDebugMode(isDebugModeEnabled: boolean) {
        this.isDebugModeEnabled = isDebugModeEnabled;
        this.configureLogger();
    }

    public setLevelInfo(value: string) {
        this.levelInfo = LevelInfoRecord[value];
        this.configureLogger();

    }

    private configureLogger() {
        if (this.levelInfo >= LevelInfoRecord.debug && this.isDebugModeEnabled) {
            this.debug = console.log.bind(window.console, `[DEBUG]`);
        } else {
            this.debug = () => {
                // Disable debug mode
            };
        }

        if (this.levelInfo >= LevelInfoRecord.info && this.isDebugModeEnabled) {
            this.info = console.log.bind(window.console, `[INFO]`);
        } else {
            this.info = () => {
                // Disable info mode
            };
        }

        if (this.levelInfo >= LevelInfoRecord.warn && this.isDebugModeEnabled) {
            this.warn = console.log.bind(window.console, `[WARN]`);
        } else {
            this.warn = () => {
                // Disable warn mode
            };
        }

        if (this.levelInfo >= LevelInfoRecord.error && this.isDebugModeEnabled) {
            this.error = console.log.bind(window.console, `[ERROR]`);
        } else {
            this.error = () => {
                // Disable error mode
            };
        }
    }

    public static getInstance(): LogInterface {
        if (!Log.instance) {
            Log.instance = new Log();
        }
        return Log.instance;
    }
}

export const LOGGER = Log.getInstance();