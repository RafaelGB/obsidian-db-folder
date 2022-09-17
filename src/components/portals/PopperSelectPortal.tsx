import PlusIcon from "components/img/Plus";
import Relationship from "components/RelationShip";
import { grey, randomColor } from "helpers/Colors";
import { StyleVariables } from "helpers/Constants";
import React, {
  KeyboardEventHandler,
  MouseEventHandler,
  useState,
} from "react";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";
import { CellComponentProps } from "cdm/ComponentsModel";
import CrossIcon from "components/img/CrossIcon";
import { TableColumn } from "cdm/FolderModel";

const PopperSelectPortal = (popperProps: CellComponentProps) => {
  const { defaultCell } = popperProps;
  const { row, column, table } = defaultCell;
  const { tableState, view } = table.options.meta;
  const dataActions = tableState.data((state) => state.actions);

  const selectPortalRow = tableState.data((state) => state.rows[row.index]);

  const columns = tableState.columns((state) => state.columns);

  const ddbbConfig = tableState.configState((state) => state.ddbbConfig);

  const tableColumn = column.columnDef as TableColumn;

  // Selector reference state
  const [selectRef, setSelectRef] = useState(null);
  const [showSelect, setShowSelect] = useState(false);
  // Selector popper state
  const [selectPop, setSelectPop] = useState(null);
  const { styles, attributes } = usePopper(selectRef, selectPop);
  // Show add button
  const [showAdd, setShowAdd] = useState(false);
  // Selector popper state
  const [domReady, setDomReady] = useState(false);

  const columnActions = table.options.meta.tableState.columns(
    (state) => state.actions
  );

  React.useEffect(() => {
    if (!domReady) {
      setDomReady(true);
    }
  });

  const handleRemoveOption: MouseEventHandler<HTMLDivElement> = () => {
    dataActions.updateCell(
      row.index,
      column.columnDef as TableColumn,
      "",
      columns,
      ddbbConfig,
      true
    );
    setShowSelect(false);
  };

  function handleOptionClick(option: {
    label: string;
    backgroundColor?: string;
  }) {
    // save on disk & move file if its configured on the column
    dataActions.updateCell(
      row.index,
      column.columnDef as TableColumn,
      option.label,
      columns,
      ddbbConfig,
      true
    );
    setShowSelect(false);
  }

  const handleOptionBlur = (e: any) => {
    if (e.target.value !== "") {
      addNewOption(e);
    }
    setShowAdd(false);
  };

  const handleOptionKeyDown: KeyboardEventHandler<HTMLInputElement> = (
    e: any
  ) => {
    if (e.key === "Enter" && e.target.value !== "") {
      addNewOption(e);
      setShowAdd(false);
    }
  };
  function addNewOption(e: any) {
    // check if option already exists
    const alreadyExist = tableColumn.options.find(
      (option: { label: string }) => {
        if (option.label === e.target.value) {
        }
      }
    );
    if (!alreadyExist) {
      columnActions.addOptionToColumn(
        tableColumn,
        e.target.value,
        randomColor()
      );
    }
  }

  function getColor() {
    const match = tableColumn.options.find(
      (option: { label: string }) =>
        option.label === selectPortalRow[tableColumn.key]
    );
    return (match && match.backgroundColor) || grey(200);
  }

  function PortalSelect() {
    return (
      <div>
        {/* hide selector if click outside of it */}
        {showSelect && (
          <div className="overlay" onClick={() => setShowSelect(false)} />
        )}
        {/* show selector if click on the current value */}
        {showSelect && (
          <div
            className="menu"
            ref={setSelectPop}
            {...attributes.popper}
            style={{
              ...styles.popper,
              zIndex: 4,
              minWidth: 200,
              maxWidth: 320,
              padding: "0.75rem",
              background: StyleVariables.BACKGROUND_SECONDARY,
            }}
          >
            <div
              className="d-flex flex-wrap-wrap"
              style={{ marginTop: "-0.5rem" }}
            >
              {tableColumn.options.map((option: any) => (
                <div
                  key={option.label}
                  className="cursor-pointer"
                  style={{ marginRight: "0.5rem", marginTop: "0.5rem" }}
                  onClick={() => handleOptionClick(option)}
                >
                  <Relationship
                    value={option.label}
                    backgroundColor={option.backgroundColor}
                  />
                </div>
              ))}
              {showAdd && (
                <div
                  style={{
                    marginRight: "0.5rem",
                    marginTop: "0.5rem",
                    width: 120,
                    padding: "2px 4px",
                    borderRadius: 4,
                  }}
                >
                  <input
                    type="text"
                    className="option-input"
                    onBlur={handleOptionBlur}
                    onKeyDown={handleOptionKeyDown}
                  />
                </div>
              )}
              <div
                className="cursor-pointer"
                style={{ marginRight: "0.5rem", marginTop: "0.5rem" }}
                onClick={() => setShowAdd(true)}
              >
                <span className="svg-icon-sm svg-text">
                  <PlusIcon />
                </span>
              </div>
              <div
                className="cursor-pointer"
                style={{ marginRight: "0.5rem", marginTop: "0.5rem" }}
                onClick={handleRemoveOption}
              >
                <span className="svg-icon-sm svg-text">
                  <CrossIcon />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Current value of the select */}
      <div
        ref={setSelectRef}
        className="cell-padding d-flex cursor-default align-items-center flex-1"
        onClick={() => setShowSelect(true)}
        style={{ width: column.getSize() }}
      >
        {selectPortalRow[tableColumn.key] && (
          <Relationship
            value={selectPortalRow[tableColumn.key].toString()}
            backgroundColor={getColor()}
          />
        )}
      </div>
      {domReady
        ? ReactDOM.createPortal(PortalSelect(), activeDocument.body)
        : null}
    </>
  );
};

export default PopperSelectPortal;
