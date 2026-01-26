'use client';

import { Component, ReactNode } from 'react';
import { backupSystem } from '@/lib/backup-system';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: '' };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    };
    
    try {
      const existingLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      existingLogs.push(errorLog);
      
      if (existingLogs.length > 50) {
        existingLogs.shift();
      }
      
      localStorage.setItem('errorLogs', JSON.stringify(existingLogs));
    } catch {
      console.error('[ErrorBoundary] Failed to save error log');
    }
    
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleRecovery = async (): Promise<void> => {
    try {
      const recovered = await backupSystem.recover();
      if (recovered) {
        sessionStorage.setItem('recoveryMode', 'true');
        sessionStorage.setItem('recoveredData', JSON.stringify(recovered.data));
        window.location.reload();
      } else {
        alert('No backup data found to recover.');
      }
    } catch (err) {
      console.error('[ErrorBoundary] Recovery failed:', err);
      alert('Recovery failed. Please try refreshing the page.');
    }
  };

  handleExportLogs = (): void => {
    try {
      const logs = localStorage.getItem('errorLogs');
      if (logs) {
        const blob = new Blob([logs], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `error-logs-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        alert('No error logs found.');
      }
    } catch {
      alert('Failed to export logs.');
    }
  };

  handleRefresh = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-600 mb-6">
              An unexpected error occurred. Your data has been preserved in local backup.
            </p>
            
            {this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-left">
                <p className="text-sm font-mono text-red-800 truncate">
                  {this.state.error.message}
                </p>
              </div>
            )}
            
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleRefresh}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleRecovery}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Recover from Backup
              </button>
              <button
                onClick={this.handleExportLogs}
                className="w-full px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
              >
                Export Error Logs
              </button>
            </div>
            
            <p className="text-xs text-slate-400 mt-6">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
        <p className="text-slate-600 mb-4">{error.message}</p>
        <button
          onClick={resetError}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
