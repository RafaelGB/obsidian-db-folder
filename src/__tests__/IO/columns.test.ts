import { obtainMetadataColumns, obtainColumnsFromFolder } from "components/Columns";
import { DEFAULT_SETTINGS, MetadataColumns } from "helpers/Constants";
import { generateYamlColumns } from "mock/mockTableUtils";
describe("IO.columns", () => {
    /** Metadata columns */
    test('obtainMetadataColumns()', async () => {
        // Check if mandatory columns exists
        const columnsRecord = await obtainMetadataColumns(generateYamlColumns(5), DEFAULT_SETTINGS.local_settings);
        expect(columnsRecord).toHaveProperty(MetadataColumns.FILE);
        expect(columnsRecord).toHaveProperty(MetadataColumns.ADD_COLUMN);
    });
    /** Table columns */
    test('obtainColumnsFromFolder()', async () => {
        const columnsRecord = await obtainMetadataColumns(generateYamlColumns(5), DEFAULT_SETTINGS.local_settings);
        const tableColumns = await obtainColumnsFromFolder(columnsRecord);
        expect(tableColumns.length >= 5).toBeTruthy();
    });
}); 