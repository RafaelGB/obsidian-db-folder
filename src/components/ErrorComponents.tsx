import React from "react";

export function generateErrorComponent(
  errors: Record<string, string[]>
): JSX.Element {
  return (
    <div className="p-dbfolder-error">
      <h2>Errors</h2>
      {/* List all recorded errors*/}
      <ul>
        {Object.keys(errors).map((key) => (
          <li key={key}>
            <h3>{key}</h3>
            <ul>
              {errors[key].map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
