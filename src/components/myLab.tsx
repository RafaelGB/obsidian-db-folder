import { App} from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {DatabaseContext } from 'context/context';

const useApp = (): App | undefined => {
    return React.useContext(DatabaseContext);
  };

const ReactView = () => {
    const { vault } = useApp();
  
    return <h4>{vault.getName()}</h4>;
};

