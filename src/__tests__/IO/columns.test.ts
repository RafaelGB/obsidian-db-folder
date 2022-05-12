import { obtainMetadataColumns, obtainColumnsFromFolder } from "components/Columns";
import { MetadataColumns } from "helpers/Constants";
import { generateYamlColumns } from "mock/mockTableUtils";
describe("Columns", () => {
    /** Metadata columns */
    test('obtainMetadataColumns()', async () => {
        // Check if mandatory columns exists
        const columnsRecord = await obtainMetadataColumns(generateYamlColumns(5), {
            enable_show_state: false,
            remove_field_when_delete_column: false,
            group_folder_column: '',
            show_metadata_created: false,
            show_metadata_modified: false
        });
        expect(columnsRecord).toHaveProperty(MetadataColumns.FILE);
        expect(columnsRecord).toHaveProperty(MetadataColumns.ADD_COLUMN);
    });
    /** Table columns */
    test('obtainColumnsFromFolder()', async () => {
        const columnsRecord = await obtainMetadataColumns(generateYamlColumns(5), {
            enable_show_state: false,
            remove_field_when_delete_column: false,
            group_folder_column: '',
            show_metadata_created: false,
            show_metadata_modified: false
        });
        const tableColumns = await obtainColumnsFromFolder(columnsRecord);
        expect(tableColumns.length >= 5).toBeTruthy();
    });
}); 