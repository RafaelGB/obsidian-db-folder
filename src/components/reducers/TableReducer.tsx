import { TableStateInterface } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import useColumnsStore from "stateManagement/useColumnsStore";
import useConfigStore from "stateManagement/useConfigStore";
import useDataStore from "stateManagement/useDataStore";
import useInitialTypeStore from "stateManagement/useInitialTypeStore";
import useRowTemplateStore from "stateManagement/useRowTemplateStore";
import useSortingStore from "stateManagement/useSortingStore";

function useTableStore(view: DatabaseView): TableStateInterface {
  const config = useConfigStore(view);
  const data = useDataStore(view);
  const initialType = useInitialTypeStore(view);
  const rowTemplate = useRowTemplateStore(view);
  const sorting = useSortingStore(view);
  const columns = useColumnsStore(view);
  return {
    configState: config,
    initialState: initialType,
    rowTemplate: rowTemplate,
    data: data,
    sorting: sorting,
    columns: columns,
  };
}

export default useTableStore;
