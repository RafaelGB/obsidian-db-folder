import { useRef } from "react";

const reRegExChar = /[\\^$.*+?()[\]{}|]/g;
const reHasRegExChar = RegExp(reRegExChar.source);

export function generateInstanceId(len: number = 9): string {
    return Math.random()
        .toString(36)
        .slice(2, 2 + len);
}

export function escapeRegExpStr(str: string) {
    return str && reHasRegExChar.test(str)
        ? str.replace(reRegExChar, '\\$&')
        : str || '';
}

export function useIMEInputProps() {
    const isComposingRef = useRef<boolean>(false);

    return {
        // Note: these are lowercased because we use preact
        // See: https://github.com/preactjs/preact/issues/3003
        onCompositionStart: () => {
            isComposingRef.current = true;
        },
        onCompositionEnd: () => {
            isComposingRef.current = false;
        },
        getShouldIMEBlockAction: () => {
            return isComposingRef.current;
        },
    };
}