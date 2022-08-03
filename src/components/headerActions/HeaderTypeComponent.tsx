import { HeaderActionModel } from "cdm/HeaderActionModel";
import React from "react";

function headerTypeComponent(headerAction: HeaderActionModel) {
  return (
    <div key={headerAction.label}>
      <div className="menu-item sort-button" onClick={headerAction.onClick}>
        <span className="svg-icon svg-text icon-margin">
          {headerAction.icon}
        </span>
        <span style={{ textTransform: "capitalize" }}>
          {headerAction.label}
        </span>
      </div>
    </div>
  );
}
export default headerTypeComponent;
