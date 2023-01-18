import { DatabaseView } from "views/DatabaseView";
import Fuse from "fuse.js";
import { useIMEInputProps } from "helpers/Generators";
import { c } from "helpers/StylesHelper";
import { getParentBodyElement } from "helpers/WindowElement";
import { RefObject, useEffect, useRef } from "react";

import {
  LinkSuggestion,
  getBlockSearchConfig,
  getFileSearchConfig,
  getHeadingSearchConfig,
} from "components/cellTypes/Editor/filepicker";
import { getTagSearchConfig } from "components/cellTypes/Editor/tagpicker";
import {
  StrategyProps,
  Textcomplete,
} from "components/cellTypes/Editor/textcomplete/textcomplete-core";
import { InputEditor } from "components/cellTypes/Editor/textcomplete/textcomplete-input";

export interface ConstructAutocompleteParams {
  inputRef: RefObject<HTMLTextAreaElement>;
  isAutocompleteVisibleRef: RefObject<boolean>;
  view: DatabaseView;
}

export function constructAutocomplete({
  inputRef,
  isAutocompleteVisibleRef,
  view,
}: ConstructAutocompleteParams) {
  const stateManager = view.getStateManager();
  const filePath = view.file.path;
  const tags = Object.keys((app.metadataCache as any).getTags()).sort();
  const tagSearch = new Fuse(tags);

  const linkSuggestions = (app.metadataCache as any)
    .getLinkSuggestions()
    .filter(
      (suggestion: LinkSuggestion) => !!suggestion.file
    ) as Array<LinkSuggestion>;

  const fileSearch = new Fuse(linkSuggestions, {
    keys: ["file.basename", "alias"],
  });

  const willAutoPairBrackets = view.app.vault.getConfig("autoPairBrackets");

  const configs: StrategyProps[] = [
    getTagSearchConfig(tags, tagSearch),
    getBlockSearchConfig(filePath, stateManager, willAutoPairBrackets, true),
    getBlockSearchConfig(filePath, stateManager, willAutoPairBrackets, false),
    getHeadingSearchConfig(filePath, stateManager, willAutoPairBrackets, true),
    getHeadingSearchConfig(filePath, stateManager, willAutoPairBrackets, false),
    getFileSearchConfig(
      view.getWindow(),
      linkSuggestions,
      fileSearch,
      filePath,
      stateManager,
      willAutoPairBrackets,
      true
    ),
    getFileSearchConfig(
      view.getWindow(),
      linkSuggestions,
      fileSearch,
      filePath,
      stateManager,
      willAutoPairBrackets,
      false
    ),
  ];

  const editor = new InputEditor(inputRef.current);
  const autocomplete = new Textcomplete(editor, configs, {
    dropdown: {
      parent: getParentBodyElement(inputRef.current),
      maxCount: 96,
      className: `${c("autocomplete")} ${c("ignore-click-outside")}`,
      rotate: true,
      item: {
        className: `${c("autocomplete-item")} ${c("ignore-click-outside")}`,
        activeClassName: `${c("autocomplete-item-active")} ${c(
          "ignore-click-outside"
        )}`,
      },
    },
  });

  autocomplete.on("show", () => {
    (isAutocompleteVisibleRef as any).current = true;
  });

  autocomplete.on("hidden", () => {
    (isAutocompleteVisibleRef as any).current = false;
  });

  let keydownHandler: (e: KeyboardEvent) => void;

  return () => {
    if (inputRef.current) {
      inputRef.current.removeEventListener("keydown", keydownHandler);
    }

    autocomplete.destroy();
    editor.destroy();
  };
}

export interface UseAutocompleteInputPropsParams {
  isInputVisible: boolean;
  view: DatabaseView;
  onEnter?: (e: KeyboardEvent) => boolean | void;
  onEscape?: (e: KeyboardEvent) => boolean | void;
  onKeyDown?: (e: KeyboardEvent) => boolean | void;
}

export function useAutocompleteInputProps({
  isInputVisible,
  onEnter,
  onEscape,
  onKeyDown,
  view,
}: UseAutocompleteInputPropsParams) {
  const isAutocompleteVisibleRef = useRef<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>();
  const { onCompositionStart, onCompositionEnd, getShouldIMEBlockAction } =
    useIMEInputProps();

  useEffect(() => {
    const input = inputRef.current;

    if (isInputVisible && input) {
      input.focus();
      input.selectionStart = input.selectionEnd = input.value.length;

      return constructAutocomplete({
        inputRef,
        isAutocompleteVisibleRef,
        view,
      });
    }
  }, [isInputVisible]);

  return {
    ref: inputRef,
    onCompositionStart,
    onCompositionEnd,
    onKeyDownCapture: (e: any) => {
      if (getShouldIMEBlockAction() || isAutocompleteVisibleRef.current) {
        return;
      }

      const handled = onKeyDown(e);

      if (handled) return;

      if (e.key === "Enter") {
        onEnter && onEnter(e);
      } else if (e.key === "Escape") {
        onEscape && onEscape(e);
      }
    },
  };
}
