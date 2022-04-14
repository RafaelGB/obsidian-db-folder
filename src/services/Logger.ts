export interface LogInterface{
    debug(primaryMessage: string, ...supportingData: any[]):void;
    info(primaryMessage: string, ...supportingData: any[]):void;
    warn(primaryMessage: string, ...supportingData: any[]):void;
    error(primaryMessage: string, ...supportingData: any[]):void;
    setDebugMode(isDebugModeEnabled: boolean):void;
    setLevelInfo(value: string):void;
}

const LevelInfoRecord: Record<string, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};
class Log implements LogInterface{
    private static instance: LogInterface;
    private isDebugModeEnabled: boolean = false;
    private levelInfo:number = 1;
    private constructor() {}

    public debug(primaryMessage: string, ...supportingData: any[]){
        this.emitLogMessage("debug", primaryMessage, ...supportingData);
    }
    public info(primaryMessage: string, ...supportingData: any[]){
        if(this.levelInfo >= LevelInfoRecord.info){
            this.emitLogMessage("info", primaryMessage, ...supportingData);
        }
    }
    public warn(primaryMessage: string, ...supportingData: any[]){
        if(this.levelInfo >= LevelInfoRecord.warn){
            this.emitLogMessage("warn", primaryMessage, ...supportingData);
        }
    }
    public error(primaryMessage: string, ...supportingData: any[]){
        if(this.levelInfo >= LevelInfoRecord.error){
            this.emitLogMessage("error", primaryMessage, ...supportingData);
        }
    }

    public setDebugMode(isDebugModeEnabled: boolean){
        this.isDebugModeEnabled = isDebugModeEnabled;
    }
    
    public setLevelInfo(value: string){
        this.levelInfo = LevelInfoRecord[value];
    }

    public static getInstance(): LogInterface {
        if (!Log.instance) {
            Log.instance = new Log();
        }

        return Log.instance;
    }

    private emitLogMessage(level:"debug"|"info"|"warn"|"error", message: string, ...supportingData: any[]):void{
        // Do not log if debug mode is disabled
        if(!this.isDebugModeEnabled){
            return;
        }
        let moment: string = new Date().toISOString();
        if(supportingData.length > 0){
            console.log(`[${moment}] [${level}] ${message}`, supportingData);
        }else{
            console.log(`[${moment}] [${level}] ${message}`);
        }
    }
}

export const LOGGER = Log.getInstance();