import { ColorPickerProps } from "cdm/StyleModel";
import React from "react";
import { ColorResult, SketchPicker } from "react-color";
import { castHslToString } from "./styles/ColumnWidthStyle";

export function ColorPicker(colorPickerProps: ColorPickerProps) {
  const { view, options, option, columnKey } = colorPickerProps;
  const [colorState, setColorState] = React.useState(option.backgroundColor);
  const [labelState, setLabelState] = React.useState(option.label);
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
    setShowColorPicker(false);
    // Persist changes
    await view.diskConfig.updateColumnConfig(columnKey, {
      options: options,
    });
  }
  return (
    <>
      <span
        className="colorPicker"
        onClick={() => setShowColorPicker(!showColorPicker)}
        style={{ backgroundColor: colorState, padding: "5px" }}
      >
        {labelState}
      </span>
      {showColorPicker && (
        <SketchPicker
          color={colorState}
          onChange={handleChange}
          onChangeComplete={handleChangeComplete}
        />
      )}
    </>
  );
}
