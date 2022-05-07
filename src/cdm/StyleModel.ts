export type ColumnWidthState = {
    widthRecord: Record<string, number>
}

export type HeaderContextType = {
    columnWidthState: ColumnWidthState,
    setColumnWidthState: (a: ColumnWidthState) => void
}