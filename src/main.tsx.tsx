// Enhanced Entry Point - ClipFlow AI
import React from 'react';
import ReactDOM from 'react-dom/client';
import ClipFlowAI from './App.tsx';
import './index.css';

// Performance monitoring setup
if (process.env.NODE_ENV === 'development') {
  // Enable React DevTools
  import('react-devtools');
  
  // Performance monitoring
  if ('performance' in window && 'measure' in window.performance) {
    performance.mark('app-start');
  }
}

// Error boundary for production error handling
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ClipFlow AI Error:', error, errorInfo);
    
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Add error reporting service here
      // reportError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="max-w-md text-center p-8">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">
              ClipFlow AI encountered an unexpected error. Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
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

// Service Worker Registration for PWA capabilities
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Performance observer setup
if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
  // Monitor largest contentful paint
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime);
      }
    });
  });
  
  observer.observe({ entryTypes: ['largest-contentful-paint'] });
}

// Memory usage monitoring
if (typeof window !== 'undefined' && 'memory' in performance) {
  setInterval(() => {
    const memory = (performance as any).memory;
    if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8) {
      console.warn('High memory usage detected:', {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      });
    }
  }, 30000); // Check every 30 seconds
}

// Main application rendering
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ClipFlowAI />
    </ErrorBoundary>
  </React.StrictMode>
);

// Performance measurement for development
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      if ('performance' in window && 'measure' in window.performance) {
        performance.mark('app-end');
        performance.measure('app-load', 'app-start', 'app-end');
        
        const measure = performance.getEntriesByName('app-load')[0] as PerformanceMeasure;
        console.log('App load time:', measure.duration.toFixed(2), 'ms');
      }
    }, 0);
  });
}

// Export for potential module federation
declare global {
  interface Window {
    ClipFlowAI?: {
      version: string;
      environment: string;
    };
  }
}

window.ClipFlowAI = {
  version: '2.0.0',
  environment: process.env.NODE_ENV || 'development'
};

// Hot module replacement support for development
if (import.meta.hot) {
  import.meta.hot.accept();
}