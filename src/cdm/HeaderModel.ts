import { DatabaseHeaderProps } from "cdm/FolderModel";

export type HeaderMenuProps = {
    headerProps: DatabaseHeaderProps;
    setSortBy: any;
    propertyIcon: any;
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
    created: boolean;
    referenceElement: any;
    labelState: string;
    setLabelState: (label: string) => void;
};