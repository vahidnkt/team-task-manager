import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button, Result } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Result
              status="error"
              title="Something went wrong"
              subTitle="An unexpected error occurred. Please try refreshing the page."
              extra={[
                <Button
                  key="reload"
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={this.handleReload}
                  className="mr-2"
                >
                  Reload Page
                </Button>,
                <Button key="retry" onClick={this.handleReset}>
                  Try Again
                </Button>,
              ]}
            />
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-red-800 font-semibold mb-2">
                  Error Details:
                </h4>
                <pre className="text-xs text-red-700 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
