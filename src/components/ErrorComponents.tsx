import React from "react";

export function boundaryPreRendererComponent(errors: Record<string, string[]>) {
  return (
    <div className="p-dbfolder-error">
      <h2>Errors</h2>
      {/* List all recorded errors*/}
      <ul>
        {Object.keys(errors).map((key, indexGroup) => {
          const errorList = errors[key];
          return (
            <li key={`error-li-${indexGroup}`}>
              <h3>{key}</h3>
              <ul key={`error-ul-${indexGroup}`}>
                {errorList.map((error, indexDetail) => (
                  <li key={`error-li-${indexGroup}-${indexDetail}`}>
                    {error.toString()}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
