import {AbstractHandler} from 'database/parse/handlers/AbstractHandler';
import { App } from "obsidian";

export class TitleHandler extends AbstractHandler {
    public handle(yaml: any, app: App): string[] {

        if (!!yaml.title){
            this.listOfErrors.push('Title is empty or is not defined');
            // handle is ended if title is empty or not defined
            return this.listOfErrors;
        }

        // Check next handler
        if (this.nextHandler) {
            return this.nextHandler.handle(yaml,app);
        }
        return this.listOfErrors;
    }
}
