export interface LogInterface {
    trace(...args: unknown[]): void;
    debug(...args: unknown[]): void;
    info(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    error(...args: unknown[]): void;
    setDebugMode(isDebugModeEnabled: boolean): void;
    setLevelInfo(value: string): void;
}

const LevelInfoRecord: Record<string, number> = {
    trace: 4,
    debug: 3,
    info: 2,
    warn: 1,
    error: 0
};

class Log implements LogInterface {
    private static instance: LogInterface;
    private isDebugModeEnabled: boolean;
    private levelInfo: number;

    public trace: (...args: unknown[]) => void = (...args: unknown[]) => {
        // Disable trace mode
    }

    public debug: (...args: unknown[]) => void = (...args: unknown[]) => {
        // Disable debug mode
    }

    public info: (...args: unknown[]) => void = (...args: unknown[]) => {
        // Disable info mode
    }

    public warn: (...args: unknown[]) => void = (...args: unknown[]) => {
        // Disable warn mode
    }

    public error: (...args: unknown[]) => void = (...args: unknown[]) => {
        // Disable error mode
    }

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
        if (this.levelInfo >= LevelInfoRecord.trace && this.isDebugModeEnabled) {
            this.trace = console.log.bind(console, `[TRACE]`);
        } else {
            this.trace = (...args: unknown[]) => {
                // Disable trace mode
            }
        }

        if (this.levelInfo >= LevelInfoRecord.debug && this.isDebugModeEnabled) {
            this.debug = console.log.bind(console, `[DEBUG]`);
        } else {
            this.debug = () => {
                // Disable debug mode
            };
        }

        if (this.levelInfo >= LevelInfoRecord.info && this.isDebugModeEnabled) {
            this.info = console.log.bind(console, `[INFO]`);
        } else {
            this.info = (...args: unknown[]) => {
                // Disable info mode
            }
        }

        if (this.levelInfo >= LevelInfoRecord.warn && this.isDebugModeEnabled) {
            this.warn = console.log.bind(console, `[WARN]`);
        } else {
            this.warn = (...args: unknown[]) => {
                // Disable warn mode
            }
        }

        if (this.levelInfo >= LevelInfoRecord.error && this.isDebugModeEnabled) {
            this.error = console.log.bind(console, `[ERROR]`);
        } else {
            this.error = (...args: unknown[]) => {
                // Disable error mode
            }
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