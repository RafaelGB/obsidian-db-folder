import React from "react";

export function generateErrorComponent(error: String): JSX.Element {
  return (
    <div className="p-dbfolder-error">
      <p>{error}</p>
    </div>
  );
}
