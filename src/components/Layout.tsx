import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {children}
      </div>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  );
}