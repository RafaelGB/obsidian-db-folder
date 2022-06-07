import { StyleVariables } from "helpers/Constants";
import {
    StylesConfig,
    GroupBase,
} from "react-select";

const CustomTagsStyles: StylesConfig<any, true, GroupBase<any>> = {
    container: () => ({
        position: "static",
        boxSizing: "border-box",
    }),
    menu: () => ({
        position: "fixed",
        backgroundColor: `${StyleVariables.BACKGROUND_SECONDARY}`,
    }),
    menuPortal: (base) => ({
        ...base,
        position: "fixed",
        zIndex: 9999,
    }),
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data }) => ({
        ...styles,
        backgroundColor: data.color,
    }),
    multiValue: (styles, { data }) => {
        return {
            ...styles,
            backgroundColor: data.color,
        };
    },
    multiValueLabel: (styles) => ({
        ...styles,
        color: "black",
    }),
    multiValueRemove: (styles, { data }) => ({
        ...styles,
        color: "black",
        ":hover": {
            backgroundColor: data.color,
            color: "white",
        },
    }),
};
export default CustomTagsStyles;