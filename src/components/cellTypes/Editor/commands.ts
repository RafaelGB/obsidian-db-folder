import { insertTextAtCursor } from 'components/cellTypes/Editor/insertTextAtCursor';
import {
  applyWrappingFormatting,
  expandSelectionToLineBoundaries,
  getStateFromInput,
  replaceSelection,
  setSelectionRange,
  toggleLineFormatting,
  toggleWrappingFormattingCommand,
} from 'components/cellTypes/Editor/helpers';

export const commandIds = [
  'editor:toggle-blockquote',
  'editor:toggle-bold',
  'editor:toggle-bullet-list',
  'editor:toggle-checklist-status',
  'editor:toggle-code',
  'editor:toggle-highlight',
  'editor:toggle-italics',
  'editor:toggle-numbered-list',
  'editor:toggle-strikethrough',
];

const isBoldedRegEx = /^[*_]{2}(.+)[*_]{2}$/;
function unBold(str: string) {
  return str.replace(isBoldedRegEx, '$1');
}

const isItalicizedRegEx = /^[*_]{1}(.+)[*_]{1}$/;
function unItalicize(str: string) {
  return str.replace(isItalicizedRegEx, '$1');
}

const isCodeRegEx = /^`{1}(.+)`{1}$/;
function unCode(str: string) {
  return str.replace(isCodeRegEx, '$1');
}

const isHighlightedRegEx = /^={2}(.+)={2}$/;
function unHighlight(str: string) {
  return str.replace(isHighlightedRegEx, '$1');
}

const isStrikedRegEx = /^~{2}(.+)~{2}$/;
function unStrike(str: string) {
  return str.replace(isStrikedRegEx, '$1');
}

const isQuoted = /^(?:>.+?(?:[\r\n]|$))+$/;
function applyQuote(str: string) {
  const quoted = str
    .split('\n')
    .map((line) => {
      if (line[0] === '>') {
        return line;
      }

      return `> ${line}`;
    })
    .join('\n');

  return quoted;
}

function removeQuote(str: string) {
  const unquoted = str
    .split('\n')
    .map((line) => {
      if (line[0] !== '>') {
        return line;
      }

      return line.replace(/^>+\s*/, '');
    })
    .join('\n');

  return unquoted;
}

const isOrderedList = /^(?:\s*\d+[.)]\s+.*?(?:[\r\n]|$))+$/;
const isOrderedEmptyCheck = /^(?:\s*\d+[.)]\s+\[\s+\]\s+.*?(?:[\r\n]|$))+$/;
const isOrderedChecked = /^(?:\s*\d+[.)]\s+\[[^\]\s]+\]\s+.*?(?:[\r\n]|$))+$/;

function getIndent(line: string) {
  return line.match(/^\s*/)[0].length;
}

function getOrdinal(line: string) {
  return parseInt(line.match(/^\s*(\d+)/)[1], 10);
}

function applyOrderedList(str: string) {
  const indentCounter = [0];
  let lastIndent = 0;

  return str
    .split('\n')
    .map((line) => {
      const lineIndent = getIndent(line);

      if (lineIndent > lastIndent) {
        indentCounter.push(0);
      } else if (lineIndent < lastIndent) {
        indentCounter.pop();
      }

      lastIndent = lineIndent;

      if (isOrderedList.test(line)) {
        const ordinal = getOrdinal(line);

        indentCounter[indentCounter.length - 1] = ordinal;

        return line;
      }

      indentCounter[indentCounter.length - 1] =
        indentCounter[indentCounter.length - 1] + 1;

      return line.replace(
        /^(\s*)/,
        `$1${indentCounter[indentCounter.length - 1]}. `
      );
    })
    .join('\n');
}

function removeOrderedList(str: string) {
  return str
    .split('\n')
    .map((line) => {
      if (!isOrderedList.test(line)) {
        return line;
      }

      return line.replace(/^(\s*)\d+[.)]\s+/, '$1');
    })
    .join('\n');
}

const isBulleted = /^(?:\s*[-*+]\s+.*?(?:[\r\n]|$))+$/;
const isBulletEmptyCheck = /^(?:\s*[-*+]\s+\[\s+\]\s+.*?(?:[\r\n]|$))+$/;
const isBulletChecked = /^(?:\s*[-*+]\s+\[[^\]\s]+\]\s+.*?(?:[\r\n]|$))+$/;

function applyBullet(str: string) {
  const bulleted = str
    .split('\n')
    .map((line) => {
      if (isBulleted.test(line)) {
        return line;
      }

      return line.replace(/^(\s*)/, '$1- ');
    })
    .join('\n');

  return bulleted;
}

function bulletToEmptyCheckbox(str: string) {
  return str
    .split('\n')
    .map((line) => {
      if (isBulletEmptyCheck.test(line) || isBulletChecked.test(line)) {
        return line;
      }

      return line.replace(/^(\s*[-*+]\s+)/, '$1[ ] ');
    })
    .join('\n');
}

function orderedListToEmptyCheckbox(str: string) {
  return str
    .split('\n')
    .map((line) => {
      if (isOrderedEmptyCheck.test(line) || isOrderedChecked.test(line)) {
        return line;
      }

      return line.replace(/^(\s*\d+[.)]\s+)/, '$1[ ] ');
    })
    .join('\n');
}

function checkedToEmpty(str: string) {
  return str
    .split('\n')
    .map((line) => {
      if (isBulletEmptyCheck.test(line)) {
        return line;
      }

      return line.replace(/^(\s*[-*+]\s+)\[[^\]]\]/, '$1[ ]');
    })
    .join('\n');
}

function orderedCheckedToEmpty(str: string) {
  return str
    .split('\n')
    .map((line) => {
      if (isOrderedEmptyCheck.test(line)) {
        return line;
      }

      return line.replace(/^(\s*\d+[.)]\s+)\[[^\]]{1}\]/, '$1[ ]');
    })
    .join('\n');
}

function emptyToChecked(str: string) {
  return str
    .split('\n')
    .map((line) => {
      if (isBulletChecked.test(line)) {
        return line;
      }

      return line.replace(/^(\s*[-*+]\s+)\[\s\]/, '$1[x]');
    })
    .join('\n');
}

function orderedEmptyToChecked(str: string) {
  return str
    .split('\n')
    .map((line) => {
      if (isOrderedChecked.test(line)) {
        return line;
      }

      return line.replace(/^(\s*\d+[.)]\s+)\[\s\]/, '$1[x]');
    })
    .join('\n');
}

function removeBullet(str: string) {
  const unbulleted = str
    .split('\n')
    .map((line) => {
      if (!isBulleted.test(line)) {
        return line;
      }

      return line.replace(/^(\s*)[-+*]\s+/, '$1');
    })
    .join('\n');

  return unbulleted;
}

export const commands: Record<string, (ta: HTMLInputElement) => void> = {
  'editor:toggle-bold': (input: HTMLInputElement) => {
    toggleWrappingFormattingCommand(input, isBoldedRegEx, unBold, '**');
  },
  'editor:toggle-code': (input: HTMLInputElement) => {
    toggleWrappingFormattingCommand(input, isCodeRegEx, unCode, '`');
  },
  'editor:toggle-italics': (input: HTMLInputElement) => {
    toggleWrappingFormattingCommand(
      input,
      isItalicizedRegEx,
      unItalicize,
      '*'
    );
  },
  'editor:toggle-highlight': (input: HTMLInputElement) => {
    toggleWrappingFormattingCommand(
      input,
      isHighlightedRegEx,
      unHighlight,
      '=='
    );
  },
  'editor:toggle-strikethrough': (input: HTMLInputElement) => {
    toggleWrappingFormattingCommand(input, isStrikedRegEx, unStrike, '~~');
  },
  'editor:toggle-blockquote': (input: HTMLInputElement) => {
    toggleLineFormatting(input, isQuoted, applyQuote, removeQuote);
  },
  'editor:toggle-bullet-list': (input: HTMLInputElement) => {
    toggleLineFormatting(input, isBulleted, applyBullet, removeBullet);
  },
  'editor:toggle-numbered-list': (input: HTMLInputElement) => {
    toggleLineFormatting(
      input,
      isOrderedList,
      applyOrderedList,
      removeOrderedList
    );
  },

  'editor:toggle-checklist-status': (input: HTMLInputElement) => {
    const state = getStateFromInput(input);
    const isEmptySelection = state.selection.end === state.selection.start;

    const lineRange = expandSelectionToLineBoundaries({
      text: state.text,
      selection: state.selection,
    });

    const selection = setSelectionRange(input, lineRange);

    let newLines = selection.selectedText;

    const isLineBulletList = isBulleted.test(newLines);
    const isLineOrderedList = isOrderedList.test(newLines);

    if (!isLineBulletList && !isLineOrderedList) {
      newLines = applyBullet(newLines);
    } else if (isLineBulletList) {
      if (isBulletEmptyCheck.test(newLines)) {
        newLines = emptyToChecked(newLines);
      } else if (isBulletChecked.test(newLines)) {
        newLines = checkedToEmpty(newLines);
      } else {
        newLines = bulletToEmptyCheckbox(newLines);
      }
    } else {
      if (isOrderedEmptyCheck.test(newLines)) {
        newLines = orderedEmptyToChecked(newLines);
      } else if (isOrderedChecked.test(newLines)) {
        newLines = orderedCheckedToEmpty(newLines);
      } else {
        newLines = orderedListToEmptyCheckbox(newLines);
      }
    }

    const newState = replaceSelection(input, newLines);

    if (isEmptySelection) {
      const diff = newLines.length - selection.selectedText.length;

      setSelectionRange(input, {
        start: state.selection.start + diff,
        end: state.selection.end + diff,
      });
    } else {
      setSelectionRange(input, {
        start: selection.selection.start,
        end: newState.selection.end,
      });
    }
  },
};

export const autoPairBracketsCommands: Record<
  string,
  (ta: HTMLInputElement) => boolean
> = {
  '(': (input) => applyWrappingFormatting(input, '(', ')', false),
  '[': (input) => applyWrappingFormatting(input, '[', ']', false, true),
  '{': (input) => applyWrappingFormatting(input, '{', '}', false),
  "'": (input) => applyWrappingFormatting(input, "'", "'", false),
  '"': (input) => applyWrappingFormatting(input, '"', '"', false),
};

export const autoPairMarkdownCommands: Record<
  string,
  (ta: HTMLInputElement) => boolean
> = {
  '*': (input) => applyWrappingFormatting(input, '*', '*', false),
  _: (input) => applyWrappingFormatting(input, '_', '_', false),
  '`': (input) => applyWrappingFormatting(input, '`', '`', false),
  '=': (input) => applyWrappingFormatting(input, '=', '=', true),
  '~': (input) => applyWrappingFormatting(input, '~', '~', true),
  $: (input) => applyWrappingFormatting(input, '$', '$', true),
  '%': (input) => applyWrappingFormatting(input, '%', '%', true),
};

const pairMap: Record<string, string> = {
  '(': ')',
  '[': ']',
  '{': '}',
  "'": "'",
  '"': '"',
  '*': '*',
  _: '_',
  '`': '`',
  '=': '=',
  '~': '~',
  $: '$',
  '%': '%',
};

export function unpair(
  input: HTMLInputElement,
  commandList: Record<string, (ta: HTMLInputElement) => boolean>
) {
  const state = getStateFromInput(input);

  if (
    state.selection.end !== state.selection.start ||
    state.selection.end === state.text.length
  ) {
    return false;
  }

  const char = state.text[state.selection.end - 1];
  const next = state.text[state.selection.end];

  if (commandList[char] && next === pairMap[char]) {
    setSelectionRange(input, {
      start: state.selection.end,
      end: state.selection.end + 1,
    });

    replaceSelection(input, '');

    return true;
  }
}

export function unpairBrackets(input: HTMLInputElement) {
  return unpair(input, autoPairBracketsCommands);
}

export function unpairMarkdown(input: HTMLInputElement) {
  return unpair(input, autoPairMarkdownCommands);
}

function applyTab(str: string, useTab: boolean, tabWidth: number) {
  const tab = useTab ? '\t' : ' '.repeat(tabWidth);

  return str
    .split('\n')
    .map((line) => {
      return tab + line;
    })
    .join('\n');
}

function removeTab(str: string, useTab: boolean, tabWidth: number) {
  const tab = useTab ? '\\t' : ' '.repeat(tabWidth);
  const firstTabRegExp = new RegExp(`^${tab}`);

  return str
    .split('\n')
    .map((line) => {
      if (!firstTabRegExp.test(line)) {
        return line;
      }

      return line.replace(firstTabRegExp, '');
    })
    .join('\n');
}

export function handleTab(
  input: HTMLInputElement,
  isShiftPressed: boolean,
  useTab: boolean,
  tabWidth: number
) {
  const initialState = getStateFromInput(input);

  if (isShiftPressed) {
    const lineRange = expandSelectionToLineBoundaries(initialState);
    const selection = setSelectionRange(input, lineRange);

    replaceSelection(
      input,
      removeTab(selection.selectedText, useTab, tabWidth)
    );

    if (initialState.selection.start === initialState.selection.end) {
      const selectionAdjust = useTab ? 1 : tabWidth;

      setSelectionRange(input, {
        start: initialState.selection.start - selectionAdjust,
        end: initialState.selection.end - selectionAdjust,
      });
    }

    return true;
  }

  const lineRange = expandSelectionToLineBoundaries(initialState);
  const selection = setSelectionRange(input, lineRange);

  const withTab = applyTab(selection.selectedText, useTab, tabWidth);
  const withInitializedOrdinal = withTab.replace(
    /^(\s*)(\d+)([.)]\s)/,
    (_, space, number, after) => {
      return `${space}1${after}`;
    }
  );

  replaceSelection(input, withInitializedOrdinal);

  return true;
}

export function handleNewLine(input: HTMLInputElement) {
  const initialState = getStateFromInput(input);

  if (initialState.selection.start !== initialState.selection.end) {
    return false;
  }

  const lineRange = expandSelectionToLineBoundaries(initialState);
  const before = input.value.slice(
    lineRange.start,
    initialState.selection.end
  );

  const line = input.value.slice(lineRange.start, lineRange.end);

  // Remove bullet list
  if (/^(\s*[-*+]\s+(?:\[[^\]]\]\s*)?)$/.test(line)) {
    setSelectionRange(input, {
      start: lineRange.start - 1,
      end: lineRange.end,
    });
    replaceSelection(input, '\n');
    return true;
  }

  // Remove ordered list
  if (/^(\s*\d[.)]\s+(?:\[[^\]]\]\s*)?)$/.test(line)) {
    setSelectionRange(input, {
      start: lineRange.start - 1,
      end: lineRange.end,
    });
    replaceSelection(input, '\n');
    return true;
  }

  // Maintain bullet list
  if (isBulleted.test(before)) {
    const pre = before.match(/^(\s*[-*+]\s+(?:\[[^\]]\]\s*)?)/)[1];
    insertTextAtCursor(
      input,
      `\n${pre.replace(/^(\s*[-*+]\s+)\[[^\]]\]/, '$1[ ]')}`
    );
    return true;
  }

  // Maintain ordered list
  if (isOrderedList.test(before)) {
    const pre = before.match(/^(\s*\d+[.)]\s+(?:\[[^\]]\]\s*)?)/)[1];
    const withEmptyCheckbox = pre.replace(/^(\s*\d+[.)]\s+)\[[^\]]\]/, '$1[ ]');
    const withIncrementedOrdinal = withEmptyCheckbox.replace(
      /^(\s*)(\d+)/,
      (_, space, number) => {
        return `${space}${parseInt(number) + 1}`;
      }
    );
    insertTextAtCursor(input, `\n${withIncrementedOrdinal}`);
    return true;
  }

  return false;
}
