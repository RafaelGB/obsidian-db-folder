import React from "react";
type HeaderButtonProps = {
  label: string;
  icon: React.ReactNode;
  onClick: (e: any) => void;
};
function headerButtonComponent(props: HeaderButtonProps) {
  return (
    <div
      key={props.label}
      className="menu-item sort-button"
      onMouseDown={props.onClick}
    >
      <span className="svg-icon svg-text icon-margin">{props.icon}</span>
      {props.label}
    </div>
  );
}
export default headerButtonComponent;
