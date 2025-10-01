import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Menu, X, Calendar, Phone } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "./ThemeToggle";

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-card shadow-soft border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-xl font-semibold text-foreground">DentalCare Pro</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-smooth hover:text-primary ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button variant="outline" size="sm" className="hidden lg:flex">
                <Phone className="w-4 h-4 mr-2" />
                (555) 123-4567
              </Button>
              {user ? (
                <>
                  <NavLink to="/admin">
                    <Button size="sm" variant="outline">
                      Dashboard
                    </Button>
                  </NavLink>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <NavLink to="/auth">
                    <Button size="sm" variant="outline">
                      Sign In
                    </Button>
                  </NavLink>
                  <NavLink to="/auth">
                    <Button size="sm" variant="medical">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Button>
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-smooth hover:text-primary px-2 py-1 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  (555) 123-4567
                </Button>
                {user ? (
                  <>
                    <NavLink to="/admin" onClick={() => setIsOpen(false)}>
                      <Button size="sm" variant="outline" className="w-full">
                        Dashboard
                      </Button>
                    </NavLink>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="w-full"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <NavLink to="/auth" onClick={() => setIsOpen(false)}>
                      <Button size="sm" variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </NavLink>
                    <NavLink to="/auth" onClick={() => setIsOpen(false)}>
                      <Button size="sm" variant="medical" className="w-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}