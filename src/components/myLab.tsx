import { App} from "obsidian";
import * as React from "react";
import {DatabaseContext } from 'context/context';

export const useApp = (): App | undefined => {
    return React.useContext(DatabaseContext);
  };
