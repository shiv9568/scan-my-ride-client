import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 text-center">
                    <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-red-500/20 bg-red-900/5">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                            <AlertCircle size={32} />
                        </div>

                        <h2 className="text-2xl font-black text-white mb-2">Something went wrong</h2>
                        <p className="text-zinc-400 mb-6 text-sm">
                            An unexpected error occurred in the application. We've logged this issue.
                        </p>

                        {this.state.error && (
                            <div className="bg-black/40 p-4 rounded-xl text-left mb-6 overflow-auto max-h-40 border border-white/5">
                                <code className="text-xs text-red-400 font-mono">
                                    {this.state.error.toString()}
                                </code>
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={this.handleReset}
                                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                            >
                                <RefreshCw size={18} /> Reload Page
                            </button>

                            <Link
                                to="/"
                                className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                                onClick={() => this.setState({ hasError: false })}
                            >
                                <Home size={18} /> Go Home
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
