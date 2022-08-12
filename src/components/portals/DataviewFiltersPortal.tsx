import Button from "@mui/material/Button";
import MenuDownIcon from "components/img/MenuDownIcon";
import { StyleVariables } from "helpers/Constants";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";

type DataviewFiltersPortalProps = {};
const DataviewFiltersPortal = (props: DataviewFiltersPortalProps) => {
  const [filtersRef, setFiltersRef] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Selector popper state
  const [selectPop, setSelectPop] = useState(null);
  const { styles, attributes } = usePopper(filtersRef, selectPop);

  const [domReady, setDomReady] = useState(false);

  React.useEffect(() => {
    if (!domReady) {
      setDomReady(true);
    }
  });
  const currentFilters = () => {
    return (
      <div>
        {/* hide selector if click outside of it */}
        {showFilters && (
          <div className="overlay" onClick={() => setShowFilters(false)} />
        )}
        {/* show selector if click on the current value */}
        {showFilters && (
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
            <span>ddddddd</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Button size="small" onClick={() => setShowFilters(true)}>
        <span className="svg-icon svg-gray" style={{ marginRight: 8 }}>
          <div ref={setFiltersRef}>
            <MenuDownIcon />
          </div>
        </span>
      </Button>

      {domReady
        ? ReactDOM.createPortal(
            currentFilters(),
            activeDocument.getElementById("popper-container")
          )
        : null}
    </>
  );
};

export default DataviewFiltersPortal;
