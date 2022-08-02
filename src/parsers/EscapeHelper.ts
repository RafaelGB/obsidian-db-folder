export function escapeSpecialCharacters(fromQuery: string): string {
    console.log("Escaping chars... from " + fromQuery)

    return fromQuery
        .replaceAll("\"", "\\\"")
        .replaceAll("\n", "\\n")
}

export function unEscapeSpecialCharacters(fromQuery: string): string {
    console.log("UNescaping chars... from " + fromQuery)
    return fromQuery
        .replaceAll("\\\"", "\"")
        .replaceAll("\\n", "\n")
}