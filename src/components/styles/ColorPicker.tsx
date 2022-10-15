import { ColorPickerProps } from "cdm/StyleModel";
import React from "react";
import { ColorResult, SketchPicker } from "react-color";
import { c } from "helpers/StylesHelper";
import { castHslToString } from "helpers/Colors";

export function ColorPicker(colorPickerProps: ColorPickerProps) {
  const { modal, options, option, columnId } = colorPickerProps;
  const { view } = modal;
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
    await view.diskConfig.updateColumnProperties(columnId, {
      options: options,
    });
    modal.enableReset = true;
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
