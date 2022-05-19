import { YamlHandler, YamlHandlerResponse } from "cdm/MashallModel";


export abstract class AbstractYamlHandler implements YamlHandler {
    abstract handlerName: string;

    protected nextHandler: YamlHandler;
    protected listOfErrors: string[] = [];
    protected localYaml: Record<string, any> = {};

    protected addError(error: string): void {
        this.listOfErrors.push(error);
    }

    public setNext(handler: YamlHandler): YamlHandler {
        this.nextHandler = handler;
        return handler;
    }

    public goNext(yamlHandlerResponse: YamlHandlerResponse): YamlHandlerResponse {
        // add possible errors to response
        if (this.listOfErrors.length > 0) {
            yamlHandlerResponse.errors[this.handlerName] = this.listOfErrors;
        }
        // add local yaml to response
        yamlHandlerResponse.yaml = { ...yamlHandlerResponse.yaml, ...this.localYaml };
        // Check next handler
        if (this.nextHandler) {
            return this.nextHandler.handle(yamlHandlerResponse);
        }
        return yamlHandlerResponse;
    }
    abstract handle(yaml: YamlHandlerResponse): YamlHandlerResponse;
}