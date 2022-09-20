import { GroupBase, StylesConfig } from "react-select";

const CustomTemplateSelectorStyles: StylesConfig<any, true, GroupBase<any>> = {
    singleValue: (styles) => ({
        ...styles,
        color: 'var(--text-normal)',
        width: "max-content",
        minWidth: "100%",
        border: 0
    }),

    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            color: 'var(--text-normal)',
            backgroundColor: 'var(--background-primary)',
            textAlign: 'left',
        }
    },
    control: (styles) => {
        return {
            ...styles,
            color: 'var(--text-normal)',
            backgroundColor: 'var(--background-primary)',
            textAlign: 'left',
            height: "max-content",
            maxHeight: "30px",
            border: 0
        }
    },
    input: (styles) => {
        return {
            ...styles,
            height: "max-content",
            maxHeight: "30px",
            border: 0
        }
    },
}

export default CustomTemplateSelectorStyles;