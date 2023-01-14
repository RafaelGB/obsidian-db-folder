
import { DbInfo, TableStateInterface } from "cdm/TableStateInterface";

function useDbInfo(tableState: TableStateInterface): DbInfo {
    const configInfo = tableState.configState(state => state.info);
    const dataInfo = tableState.data(state => state.info);
    const columnsInfo = tableState.columns(state => state.info);

    return {
        data: dataInfo,
        columns: columnsInfo,
        config: configInfo,
    }
};