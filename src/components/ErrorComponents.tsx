import React from "react";

export function generateErrorComponent(
  errors: Record<string, string[]>
): JSX.Element {
  return (
    <div className="p-dbfolder-error">
      <h2>Errors</h2>
      {errors.array.map((keyStack) => {
        <h3>{keyStack}</h3>;
        errors[keyStack].map((error) => {
          return <p>{error}</p>;
        });
      })}
    </div>
  );
}
