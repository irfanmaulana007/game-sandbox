import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { useToast } from '~/hooks';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundaryClass extends Component<
  Props & { showError: (message: string) => void },
  State
> {
  constructor(props: Props & { showError: (message: string) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.showError('Something went wrong. Please refresh the page.');
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="p-8 text-center">
            <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              Oops! Something went wrong
            </h1>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              We encountered an unexpected error. Please try refreshing the
              page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component to provide toast context to class component
const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const { error: showError } = useToast();

  return (
    <ErrorBoundaryClass showError={showError}>{children}</ErrorBoundaryClass>
  );
};

export default ErrorBoundary;
