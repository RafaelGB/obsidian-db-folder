import * as React from "react";
import AlignVerticalTopIcon from "@mui/icons-material/AlignVerticalTop";
import AlignVerticalCenterIcon from "@mui/icons-material/AlignVerticalCenter";
import AlignVerticalBottomIcon from "@mui/icons-material/AlignVerticalBottom";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { TextAlignmentProps } from "cdm/StyleModel";
import { COLUMN_ALIGNMENT_OPTIONS, StyleVariables } from "helpers/Constants";
import { t } from "lang/helpers";

export default function TextAlignmentYSelector(props: TextAlignmentProps) {
  const { modal, columnId, currentAlignment } = props;
  const { view } = modal;
  const [alignment, setAlignment] = React.useState(currentAlignment);

  const handleAlignment = async (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (newAlignment !== null) {
      // Persist changes
      await view.diskConfig.updateColumnConfig(columnId, {
        content_vertical_alignment: newAlignment,
      });
      modal.enableReset = true;
      setAlignment(newAlignment);
    }
  };

  return (
    <Stack direction="row" spacing={3}>
      <ToggleButtonGroup
        value={alignment}
        exclusive
        onChange={handleAlignment}
        aria-label={t(
          "column_settings_modal_text_alignment_vertical_select_title"
        )}
      >
        <ToggleButton
          value={COLUMN_ALIGNMENT_OPTIONS.TOP}
          aria-label={t(
            "column_settings_modal_text_alignment_vertical_select_top"
          )}
          sx={{
            color: StyleVariables.TEXT_NORMAL,
            "&.Mui-selected, &.Mui-selected:hover": {
              color: StyleVariables.TEXT_ACCENT,
            },
          }}
        >
          <AlignVerticalTopIcon />
        </ToggleButton>
        <ToggleButton
          value={COLUMN_ALIGNMENT_OPTIONS.MIDDLE}
          aria-label={t(
            "column_settings_modal_text_alignment_vertical_select_middle"
          )}
          sx={{
            color: StyleVariables.TEXT_NORMAL,
            "&.Mui-selected, &.Mui-selected:hover": {
              color: StyleVariables.TEXT_ACCENT,
            },
          }}
        >
          <AlignVerticalCenterIcon />
        </ToggleButton>
        <ToggleButton
          value={COLUMN_ALIGNMENT_OPTIONS.BOTTOM}
          aria-label={t(
            "column_settings_modal_text_alignment_vertical_select_bottom"
          )}
          sx={{
            color: StyleVariables.TEXT_NORMAL,
            "&.Mui-selected, &.Mui-selected:hover": {
              color: StyleVariables.TEXT_ACCENT,
            },
          }}
        >
          <AlignVerticalBottomIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
