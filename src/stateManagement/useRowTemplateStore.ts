import { RowTemplateState } from "cdm/TableStateInterface";
import { get_tfiles_from_folder } from "helpers/FileManagement";
import create from "zustand";

const useRowTemplateStore = (template: string, folder: string) => {
    return create<RowTemplateState>()(
        (set) => ({
            template: template,
            folder: folder,
            options: get_tfiles_from_folder(
                folder
            ).map((tfile) => {
                return {
                    value: tfile.path,
                    label: tfile.path,
                };
            }),
            clear: () => set({ template: "" }),
            update: (template: string) => set({ template })
        }),
    )();
}
export default useRowTemplateStore;