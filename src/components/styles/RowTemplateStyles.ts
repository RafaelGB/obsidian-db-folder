import { GroupBase, StylesConfig } from "react-select";

const CustomTemplateSelectorStyles: StylesConfig<any, true, GroupBase<any>> = {
    singleValue: (styles) => ({
        ...styles,
        color: 'var(--text-normal)',
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
        }
    },
    menu: (styles) => {
        return {
            ...styles,
            width: "max-content",
            minWidth: "100%"
        }
    }
}

export default CustomTemplateSelectorStyles;