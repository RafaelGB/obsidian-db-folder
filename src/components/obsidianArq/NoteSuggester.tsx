import { SUGGESTER_REGEX } from "helpers/Constants";
import Fuse from "fuse.js";
import React, { useMemo } from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";

export function suggesterFilesInFunctionOf(text: string): boolean {
  // const files: TFile[] = [];
  // // Obtain suggested files from your vault.
  // const linkSuggestions = app.metadataCache.getLinkSuggestions().filter(s => s.file !== undefined);
  // const fileSearch = new Fuse(linkSuggestions, {
  //     keys: ['file.basename', 'alias'],
  // });
  let matches = text.match(SUGGESTER_REGEX.LINK);
  if (matches) {
    const fileName = matches[1];
    console.log("String is a link!");
    return true;
  }
  matches = text.match(SUGGESTER_REGEX.EMBED);
  if (matches) {
    const fileName = matches[1];
    console.log("String is a  Embed link!");
    return true;
  }
  matches = text.match(SUGGESTER_REGEX.LINK_HEADING);
  if (matches) {
    const fileName = matches[1];
    console.log("String is a link with a heading!");
    return true;
  }
  matches = text.match(SUGGESTER_REGEX.EMBED_HEADING);
  if (matches) {
    const fileName = matches[1];
    console.log("String is a  Embed link with a heading!");
    return true;
  }
  matches = text.match(SUGGESTER_REGEX.LINK_BLOCK);
  if (matches) {
    const fileName = matches[1];
    console.log("String is a link with a block!");
    return true;
  }
  matches = text.match(SUGGESTER_REGEX.EMBED_BLOCK);
  if (matches) {
    const fileName = matches[1];
    console.log("String is a  Embed link with a block!");
    return true;
  }
}

function renderRow(props: ListChildComponentProps) {
  const { index, style } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText primary={`Item ${index + 1}`} />
      </ListItemButton>
    </ListItem>
  );
}

export default function VirtualizedSuggestionList() {
  const avaliableSuggestions = useMemo(
    () =>
      app.metadataCache
        .getLinkSuggestions()
        .filter((s) =>
          app.metadataCache
            .getLinkSuggestions()
            .filter((s) => s.file !== undefined || s.file !== null)
        ),
    []
  );
  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
      }}
    >
      <FixedSizeList
        height={400}
        width={360}
        itemSize={46}
        itemCount={avaliableSuggestions.length}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
    </Box>
  );
}
