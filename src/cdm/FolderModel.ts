export type Group = Parameter | Parameters | FolderModel | Models;
type Parameter = {
    input: string,
    optional?: boolean;
}

export type Parameters = {
    [key: string]: Parameter;
}

export type FolderModel = {
    label: string,
    path: string,
    params: Parameters
}

/** Group of FolderModel */
export type Models = {
    [key: string]: FolderModel
}

/** Note type */
export type Note = {
    id: string,
    title: string
}

export type TableColumn = {
    Header: string,
    label: string,
    accessor: string,
    minWidth?: number,
    width?:number
    dataType: string,
    options: any[]
}

export type TableRow = {
    [key: string]: any
}

export type TableRows = Array<TableRow>;

export type TableColumns = Array<TableColumn>;

export type TableDataType = {
    columns: TableColumns, 
    data: TableRows, 
    skipReset: boolean
};