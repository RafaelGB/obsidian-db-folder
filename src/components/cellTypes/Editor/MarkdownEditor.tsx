import React, { forwardRef, MutableRefObject, useEffect } from "react";
import { useAutocompleteInputProps } from "components/cellTypes/Editor/autocomplete";
import {
  autoPairBracketsCommands,
  autoPairMarkdownCommands,
  commands,
  handleTab,
  unpairBrackets,
  unpairMarkdown,
} from "components/cellTypes/Editor/commands";
import { EMITTERS_GROUPS } from "helpers/Constants";
import { MarkdownEditorProps } from "cdm/EditorModel";
import useAutosizeTextArea from "components/styles/hooks/useAutosizeTextArea";

export const MarkdownEditor = forwardRef(function MarkdownEditor(
  { onEnter, onEscape, view, ...inputProps }: MarkdownEditorProps,
  ref: MutableRefObject<HTMLTextAreaElement>
) {
  const shouldAutoPairMarkdown = app.vault.getConfig("autoPairMarkdown");
  const shouldAutoPairBrackets = app.vault.getConfig("autoPairBrackets");
  const shouldUseTab = app.vault.getConfig("useTab");
  const tabWidth = app.vault.getConfig("tabSize");
  const shouldUseMarkdownLinks = !!app.vault.getConfig("useMarkdownLinks");

  const autocompleteProps = useAutocompleteInputProps({
    isInputVisible: true,
    onEnter,
    onEscape,
    onKeyDown: (e) => {
      if (e.key === "Backspace") {
        const handledBrackets = unpairBrackets(e.target as HTMLTextAreaElement);
        if (handledBrackets) return handledBrackets;

        return unpairMarkdown(e.target as HTMLTextAreaElement);
      }

      if (e.key === "Tab") {
        e.preventDefault();

        return handleTab(
          e.target as HTMLTextAreaElement,
          e.shiftKey,
          shouldUseTab,
          tabWidth
        );
      }

      if (shouldAutoPairMarkdown) {
        const command = autoPairMarkdownCommands[e.key];
        if (command) {
          const handled = command(e.target as HTMLTextAreaElement);
          if (handled) {
            e.preventDefault();
            return true;
          }
        }
      }

      if (shouldAutoPairBrackets) {
        if (shouldUseMarkdownLinks && e.key === "[") {
          return false;
        }

        const command = autoPairBracketsCommands[e.key];
        if (command) {
          const handled = command(e.target as HTMLTextAreaElement);
          if (handled) {
            e.preventDefault();
            return true;
          }
        }
      }

      return false;
    },
    view,
  });

  useEffect(() => {
    const onHotkey = (command: string) => {
      const fn = commands[command];

      if (fn) {
        fn(autocompleteProps.ref.current);
      }
    };

    view.emitter.on(EMITTERS_GROUPS.HOTKEY, onHotkey);

    return () => {
      view.emitter.off(EMITTERS_GROUPS.HOTKEY, onHotkey);
    };
  }, [view]);

  useAutosizeTextArea(ref.current, inputProps.value.toString());

  return (
    <textarea
      {...inputProps}
      {...autocompleteProps}
      ref={(c: HTMLTextAreaElement) => {
        autocompleteProps.ref.current = c;
        ref.current = c;
      }}
      rows={inputProps.value.toString()?.split("\n").length || 1}
    />
  );
});
