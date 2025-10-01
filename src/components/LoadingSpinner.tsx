import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-gray-300 border-t-primary",
          sizeClasses[size],
          className
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );
}

export function PageLoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <LoadingSpinner size="xl" />
        <p className="text-lg text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

export function CardLoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

export function ButtonLoadingSpinner() {
  return (
    <LoadingSpinner size="sm" className="mr-2" />
  );
}

export function TableLoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size="lg" text="Loading data..." />
    </div>
  );
}
