import {AbstractYamlHandler} from 'parsers/embedYamlHandlers/AbstractYamlPropertyHandler';
import { App } from "obsidian";

export class BaseInfoHandler extends AbstractYamlHandler {
    handlerName: string = 'baseInfo';

    public handle(yaml: any): [string, string][]{

        if (!yaml.name || yaml.name.length === 0) {
            this.addError(`name of database is empty or is not defined value:${yaml.title}`);
            // handle is ended if title is empty or not defined
            return this.listOfErrors;
        }

        if (!yaml.description || yaml.description.length === 0) {
            this.addError(`description of database is not defined value:${yaml.title}`);
            // handle is ended if title is empty or not defined
            return this.listOfErrors;
        }

        // Check next handler
        if (this.nextHandler) {
            return this.nextHandler.handle(yaml);
        }
        return this.listOfErrors;
    }
}
