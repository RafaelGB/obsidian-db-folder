import { AllHTMLAttributes, DetailedHTMLProps } from "react";
import { CustomView } from "views/AbstractView";

export interface MarkdownEditorProps
    extends DetailedHTMLProps<AllHTMLAttributes<HTMLTextAreaElement>, unknown> {
    onEnter: (e: KeyboardEvent) => void;
    onEscape: (e: KeyboardEvent) => void;
    view: CustomView;
}