export function escapeSpecialCharacters(stringToEscape: string): string {
    return stringToEscape
        .replaceAll("\"", "\\\"")
        .replaceAll("\n", "\\n")
}

export function unEscapeSpecialCharacters(stringToUnescape: string): string {
    return stringToUnescape
        .replaceAll("\\\"", "\"")
        .replaceAll("\\n", "\n")
}