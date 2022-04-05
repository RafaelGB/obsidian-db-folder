import {AbstractHandler} from 'parsers/handlers/AbstractHandler';
import { App } from "obsidian";

export class TitleHandler extends AbstractHandler {
    handlerName: string = 'title';

    public handle(yaml: any, app: App): [string, string][]{

        if (!yaml.title || yaml.title.length === 0) {
            this.addError(`Title is empty or is not defined value:${yaml.title}`);
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
