import { Suspense, ComponentType, lazy } from 'react';
import { PageLoadingSpinner } from './LoadingSpinner';
import ErrorBoundary from './ErrorBoundary';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

export function LazyWrapper({ 
  children, 
  fallback = <PageLoadingSpinner />,
  errorFallback 
}: LazyWrapperProps) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// Higher-order component for lazy loading pages
export function withLazyLoading<P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);
  
  return function WrappedComponent(props: P) {
    return (
      <LazyWrapper fallback={fallback}>
        <LazyComponent {...props} />
      </LazyWrapper>
    );
  };
}

// Pre-configured lazy loaders for common page types
export const LazyPage = withLazyLoading;
export const LazyAdminPage = (importFunc: () => Promise<{ default: ComponentType<any> }>) =>
  withLazyLoading(importFunc, <PageLoadingSpinner text="Loading admin panel..." />);
export const LazyPublicPage = (importFunc: () => Promise<{ default: ComponentType<any> }>) =>
  withLazyLoading(importFunc, <PageLoadingSpinner text="Loading page..." />);
