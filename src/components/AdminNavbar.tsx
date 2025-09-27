import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Package, 
  CreditCard, 
  LogOut,
  Menu 
} from "lucide-react";

export default function AdminNavbar() {
  const { user, signOut } = useAuth();
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Appointments", path: "/admin/appointments", icon: Calendar },
    { name: "Patients", path: "/admin/patients", icon: Users },
    { name: "Inventory", path: "/admin/inventory", icon: Package },
    { name: "Transactions", path: "/admin/transactions", icon: CreditCard },
  ];

  return (
    <nav className="bg-card shadow-soft border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/admin" className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-foreground">DentalCare Pro</span>
              <span className="text-xs text-muted-foreground">Admin Dashboard</span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-soft" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Welcome, {user?.email?.split('@')[0] || 'User'}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => signOut()}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}