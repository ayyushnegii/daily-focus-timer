'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Timer Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#0a0a0f] text-gray-300">
            <h2 className="text-2xl font-bold text-neon-cyan mb-4">Oops! Something went wrong</h2>
            <p className="mb-6 text-gray-400">The timer encountered an error. Your data is safe in localStorage.</p>
            <button
              onClick={() => {
                localStorage.removeItem('pomodoro-timer-state');
                window.location.reload();
              }}
              className="neon-button"
            >
              Reset Timer & Reload
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
