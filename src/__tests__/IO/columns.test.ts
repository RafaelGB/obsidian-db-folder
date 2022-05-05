import { DatabaseColumn } from "cdm/DatabaseModel";
import { obtainMetadataColumns } from "components/Columns";
import { DataTypes, MetadataColumns } from "helpers/Constants";

test('Obtain metadata columns test', async () => {
    const result = await obtainMetadataColumns(generateYamlColumns(5));
    expect(result).toHaveProperty(MetadataColumns.FILE);
});

const generateYamlColumns = (length: number): Record<string, DatabaseColumn> => {
    const yamlColumns: Record<string, DatabaseColumn> = {};
    yamlColumns['column1'] = {
        input: DataTypes.TEXT,
        accessor: "uniqueKey",
        label: "custom label",
        key: "uniqueKey",
        position: 1,
        isMetadata: false,
        skipPersist: true,
        csvCandidate: false
    }
    return yamlColumns;
}