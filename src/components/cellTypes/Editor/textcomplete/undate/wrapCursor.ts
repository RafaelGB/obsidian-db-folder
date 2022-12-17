import { update } from 'components/cellTypes/Editor/textcomplete/undate/update';

export function wrapCursor(
  el: HTMLTextAreaElement,
  before: string,
  after?: string
) {
  const initEnd = el.selectionEnd;
  const headToCursor = el.value.substring(0, el.selectionStart) + before;
  const cursorToTail =
    el.value.substring(el.selectionStart, initEnd) +
    (after || '') +
    el.value.substring(initEnd);
  update(el, headToCursor, cursorToTail);
  el.selectionEnd = initEnd + before.length;
  return el;
}
