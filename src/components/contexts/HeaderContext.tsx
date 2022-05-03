import { HeaderContextType } from "cdm/StyleModel";
import { createContext } from "react";

export const HeaderContext = createContext<HeaderContextType | null>(null); //exporting context object
