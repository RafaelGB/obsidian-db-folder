import { HeaderActionModel } from "cdm/HeaderActionModel";
import React from "react";

function headerButtonComponent(headerAction: HeaderActionModel) {
  return (
    <div
      key={headerAction.label}
      className="menu-item sort-button"
      onMouseDown={headerAction.onClick}
    >
      <span className="svg-icon svg-text icon-margin">{headerAction.icon}</span>
      {headerAction.label}
    </div>
  );
}
export default headerButtonComponent;
