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
        position: "fixed"
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    control: (styles) => ({ ...styles, backgroundColor: "var(--background-primary)" }),
    option: (styles, { data }) => ({
        ...styles,
        backgroundColor: data.color + " !important",
        color: "rgb(66, 66, 66) !important"
    }),
    multiValue: (styles, { data }) => {
        return {
            ...styles,
            backgroundColor: data.color + " !important",
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
            backgroundColor: data.color + " !important",
            color: "white",
        },
    }),
};
export default CustomTagsStyles;