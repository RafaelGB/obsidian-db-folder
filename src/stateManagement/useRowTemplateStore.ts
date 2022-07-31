import { RowTemplateState } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import { get_tfiles_from_folder } from "helpers/FileManagement";
import create from "zustand";

const useRowTemplateStore = (view: DatabaseView) => {

    return create<RowTemplateState>()(
        (set) => ({
            template: view.diskConfig.yaml.config.current_row_template,
            folder: view.diskConfig.yaml.config.row_templates_folder,
            options: get_tfiles_from_folder(
                view.diskConfig.yaml.config.row_templates_folder
            ).map((tfile) => {
                return {
                    value: tfile.path,
                    label: tfile.path,
                };
            }),
            clear: () => set({ template: "" }),
            update: (template: string) => set({ template })
        }),
    );
}
export default useRowTemplateStore;