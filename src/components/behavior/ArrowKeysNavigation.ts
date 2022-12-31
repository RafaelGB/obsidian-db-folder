import { c } from "helpers/StylesHelper";
import { KeyboardEventHandler } from "react";

type TabIndexElement = HTMLDivElement | HTMLSpanElement;

const onKeyDownArrowKeys: KeyboardEventHandler<HTMLDivElement> = (event) => {
    const currentInput = activeDocument.activeElement;
    if (currentInput === null || !currentInput.classList.contains(c('tabIndex'))) return;

    const currentTd = currentInput.parentElement;
    const currentTr = currentTd.parentElement;
    const index = Array.from(currentTr.children).indexOf(currentTd);

    switch (event.key) {
        case "ArrowLeft":
            // Left pressed
            const TdLeft = currentTd.previousElementSibling;
            if (!TdLeft) break;
            const TdLeftTabIndex = TdLeft.getElementsByClassName(c('tabIndex'))[0] as TabIndexElement;
            if (!TdLeftTabIndex) break;
            TdLeftTabIndex.focus();
            break;
        case "ArrowRight":
            // Right pressed
            const TdRight = currentTd.nextElementSibling;
            if (!TdRight) break;
            const TdRightTabIndex = TdRight.getElementsByClassName(c('tabIndex'))[0] as TabIndexElement;
            if (!TdRightTabIndex) break;
            TdRightTabIndex.focus();
            break;
        case "ArrowUp":
            // Up pressed
            const TrUp = currentTr
                .previousElementSibling
                ?.children;
            if (!TrUp) break;

            const TdUp = (Array.from(TrUp)[index]
                .getElementsByClassName(c('tabIndex'))[0] as TabIndexElement);

            if (!TdUp) break;
            TdUp.focus();
            break;
        case "ArrowDown":
            // Down pressed
            const TrDown = currentTr
                .nextElementSibling
                ?.children;
            if (TrDown === undefined) break;

            const TdDown = (Array.from(TrDown)[index]
                .getElementsByClassName(c('tabIndex'))[0] as TabIndexElement);

            if (TdDown === undefined) break;
            TdDown.focus();
            break;
    }
}

export default onKeyDownArrowKeys;
