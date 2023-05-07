import { CustomView } from "views/AbstractView";

export interface WindowRegistry {
    viewMap: Map<string, CustomView>;
    viewStateReceivers: Array<(views: CustomView[]) => void>;
    appRoot: HTMLElement;
}