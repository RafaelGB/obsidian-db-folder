import { ColorPickerProps } from "cdm/StyleModel";
import React from "react";
import { ColorResult, SketchPicker } from "react-color";
import { castHslToString } from "components/styles/ColumnWidthStyle";
import { c } from "helpers/StylesHelper";

export function ColorPicker(colorPickerProps: ColorPickerProps) {
  const { view, options, option, columnKey } = colorPickerProps;
  const [colorState, setColorState] = React.useState(option.backgroundColor);
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  /**
   * Manage color picker
   */
  async function handleChange(
    color: ColorResult,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setColorState(castHslToString(color.hsl));
    option.backgroundColor = castHslToString(color.hsl);
  }

  async function handleChangeComplete(
    color: ColorResult,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    handleChange(color, event);
    // Persist changes
    await view.diskConfig.updateColumnProperties(columnKey, {
      options: options,
    });
  }
  return (
    <>
      <span
        className={`colorPicker ${c("relationship")}`}
        onClick={() => setShowColorPicker(!showColorPicker)}
        style={{ backgroundColor: colorState }}
      >
        {option.label}
      </span>
      {showColorPicker && (
        <div onMouseLeave={() => setShowColorPicker(false)}>
          <SketchPicker
            color={colorState}
            onChange={handleChange}
            onChangeComplete={handleChangeComplete}
          />
        </div>
      )}
    </>
  );
}
