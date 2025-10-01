import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggleCompact } from "./ThemeToggle";
import { 
  LayoutDashboard,
  Calendar,
  Users,
  Package,
  CreditCard,
  Settings,
  Menu,
  X,
  ChevronDown,
  Bell,
  Activity,
  FileText,
  BarChart3,
  Clock,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export default function AdminSidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      badge: null,
      exact: true
    },
    {
      title: "Appointments",
      href: "/admin/appointments",
      icon: Calendar,
      badge: "3",
      exact: false,
      subItems: [
        { title: "All Appointments", href: "/admin/appointments" },
        { title: "Today's Schedule", href: "/admin/appointments/today" },
        { title: "Pending Approvals", href: "/admin/appointments/pending" }
      ]
    },
    {
      title: "Patients",
      href: "/admin/patients",
      icon: Users,
      badge: null,
      exact: false,
      subItems: [
        { title: "All Patients", href: "/admin/patients" },
        { title: "Add New Patient", href: "/admin/patients/new" },
        { title: "Medical Records", href: "/admin/patients/records" }
      ]
    },
    {
      title: "Inventory",
      href: "/admin/inventory",
      icon: Package,
      badge: "5",
      exact: false,
      subItems: [
        { title: "Stock Overview", href: "/admin/inventory" },
        { title: "Low Stock Items", href: "/admin/inventory/low-stock" },
        { title: "Add Items", href: "/admin/inventory/add" },
        { title: "Suppliers", href: "/admin/inventory/suppliers" }
      ]
    },
    {
      title: "Transactions",
      href: "/admin/transactions",
      icon: CreditCard,
      badge: null,
      exact: false,
      subItems: [
        { title: "All Transactions", href: "/admin/transactions" },
        { title: "Add Transaction", href: "/admin/transactions/new" },
        { title: "Reports", href: "/admin/transactions/reports" }
      ]
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: BarChart3,
      badge: null,
      exact: false
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
      badge: null,
      exact: false
    }
  ];

  const quickStats = [
    { label: "Today's Appointments", value: "12", icon: Calendar, color: "text-blue-600" },
    { label: "Pending Approvals", value: "3", icon: Clock, color: "text-orange-600" },
    { label: "Active Patients", value: "847", icon: UserCheck, color: "text-green-600" },
    { label: "Low Stock Items", value: "5", icon: Package, color: "text-red-600" }
  ];

  const isActiveRoute = (href: string, exact: boolean = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-semibold text-foreground">DentalCare Pro</h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Stats */}
      {!isCollapsed && (
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Quick Overview</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-muted/50 rounded-lg p-2">
                  <div className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                    <div>
                      <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.href, item.exact);
          
          return (
            <div key={index}>
              <NavLink
                to={item.href}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-smooth",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  {!isCollapsed && <span>{item.title}</span>}
                </div>
                {!isCollapsed && (
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                    {item.subItems && (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                )}
              </NavLink>
              
              {/* Sub-items */}
              {!isCollapsed && item.subItems && isActive && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.subItems.map((subItem, subIndex) => (
                    <NavLink
                      key={subIndex}
                      to={subItem.href}
                      className={cn(
                        "block px-3 py-1 text-xs rounded-md transition-smooth",
                        location.pathname === subItem.href
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {subItem.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-border space-y-3">
        {!isCollapsed && (
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Theme</span>
            <ThemeToggleCompact />
          </div>
        )}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.email || 'Admin User'}
              </p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 z-50"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {isMobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
            <div className="relative flex flex-col w-64 bg-card border-r border-border">
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <SidebarContent />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden lg:flex flex-col bg-card border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}>
        <SidebarContent />
      </div>
    </>
  );
}
