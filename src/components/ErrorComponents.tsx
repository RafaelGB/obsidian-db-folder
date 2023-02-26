import React, { Component, ErrorInfo, ReactNode } from "react";
import { LOGGER } from "services/Logger";
interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export function boundaryPreRendererComponent(errors: Record<string, string[]>) {
  return (
    <div className="p-dbfolder-error">
      <h2>An error has occurred before rendering the table</h2>
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
/**
 * Error boundary component to catch errors in the table
 */
class DbErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    LOGGER.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    return this.state.hasError ? (
      <>
        <h1>Something went wrong.</h1>
        <h2>{this.state.error.message}</h2>
        <p>{this.state.error.stack}</p>
      </>
    ) : (
      this.props.children
    );
  }
}

export default DbErrorBoundary;
