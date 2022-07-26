import { GroupBase, StylesConfig } from "react-select";

const CustomTemplateSelectorStyles: StylesConfig<any, true, GroupBase<any>> = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
            ...styles,
            fontSize: '12px',
            textAlign: 'left',
            width: 'auto',
        }
    },
    placeholder: (styles) => {
        return {
            ...styles,
            fontSize: '12px',
            textAlign: 'left',
            minWidth: '17rem',
        }
    }
}

export default CustomTemplateSelectorStyles;