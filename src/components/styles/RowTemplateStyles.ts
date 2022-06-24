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
}

export default CustomTemplateSelectorStyles;