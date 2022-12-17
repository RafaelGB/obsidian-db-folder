import { DatabaseView } from "DatabaseView";
import { AllHTMLAttributes, DetailedHTMLProps } from "react";

export interface MarkdownEditorProps
    extends DetailedHTMLProps<AllHTMLAttributes<HTMLTextAreaElement>, any> {
    onEnter: (e: KeyboardEvent) => void;
    onEscape: (e: KeyboardEvent) => void;
    view: DatabaseView;
}