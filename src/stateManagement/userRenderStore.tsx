import { RenderState } from "cdm/TableStateInterface";
import create from "zustand";

const useRenderStore = () => {
  return create<RenderState>()((set) => ({
    enableRender: false,
    alterEnableRender: (enableRender) => set({ enableRender }),
  }));
};

export default useRenderStore;
