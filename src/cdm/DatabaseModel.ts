import { RowType } from "cdm/RowTypeModel"
import { LocalSettings } from "Settings"

/** database column */
export type DatabaseColumn = {
    input: string,
    Header?: string,
    key?: string,
    position?: number,
    accessor: string,
    label: string,
    isMetadata?: boolean,
    [key: string]: RowType
}

/** database yaml */
export type DatabaseYaml = {
    /** database name */
    name: string,
    /** database description */
    description: string,
    /** database columns */
    columns: Record<string, DatabaseColumn>
    /** database local configuration 
     * TODO typing*/
    config?: LocalSettings
}