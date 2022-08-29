import { DatabaseView } from "DatabaseView";
import React, {
  AllHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  Ref,
  useEffect,
} from "react";
import { useAutocompleteInputProps } from "components/cellTypes/Editor/autocomplete";
import {
  autoPairBracketsCommands,
  autoPairMarkdownCommands,
  commands,
  handleTab,
  unpairBrackets,
  unpairMarkdown,
} from "components/cellTypes/Editor/commands";

interface MarkdownEditorProps
  extends DetailedHTMLProps<AllHTMLAttributes<HTMLInputElement>, any> {
  onEnter: (e: KeyboardEvent) => void;
  onEscape: (e: KeyboardEvent) => void;
  view: DatabaseView;
}

export const MarkdownEditor = forwardRef(function MarkdownEditor(
  { onEnter, onEscape, view, ...inputProps }: MarkdownEditorProps,
  ref: Ref<HTMLInputElement>
) {
  const shouldAutoPairMarkdown = (app.vault as any).getConfig(
    "autoPairMarkdown"
  );
  const shouldAutoPairBrackets = (app.vault as any).getConfig(
    "autoPairBrackets"
  );
  const shouldUseTab = (app.vault as any).getConfig("useTab");
  const tabWidth = (app.vault as any).getConfig("tabSize");
  const shouldUseMarkdownLinks = !!(app.vault as any).getConfig(
    "useMarkdownLinks"
  );

  const autocompleteProps = useAutocompleteInputProps({
    isInputVisible: true,
    onEnter,
    onEscape,
    onKeyDown: (e) => {
      if (e.key === "Backspace") {
        const handledBrackets = unpairBrackets(e.target as HTMLInputElement);
        if (handledBrackets) return handledBrackets;

        return unpairMarkdown(e.target as HTMLInputElement);
      }

      if (e.key === "Tab") {
        e.preventDefault();

        return handleTab(
          e.target as HTMLInputElement,
          e.shiftKey,
          shouldUseTab,
          tabWidth
        );
      }

      if (shouldAutoPairMarkdown) {
        const command = autoPairMarkdownCommands[e.key];
        if (command) {
          const handled = command(e.target as HTMLInputElement);
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
          const handled = command(e.target as HTMLInputElement);
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

    view.emitter.on("hotkey", onHotkey);

    return () => {
      view.emitter.off("hotkey", onHotkey);
    };
  }, [view]);

  return (
    <input
      rows={1}
      {...inputProps}
      {...autocompleteProps}
      ref={(c: HTMLInputElement) => {
        autocompleteProps.ref.current = c;

        if (ref && typeof ref === "function") {
          ref(c);
        } else if (ref) {
          (ref as any).current = c;
        }
      }}
    />
  );
});
