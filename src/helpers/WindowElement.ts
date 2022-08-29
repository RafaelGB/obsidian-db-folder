export function getParentWindow(el: Element) {
    return el.win;
}

export function getParentBodyElement(el: Element) {
    return el.doc.body;
}

export function containsUpper(str: string) {
    return /[A-Z]/.test(str);
}