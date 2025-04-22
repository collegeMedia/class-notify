
import { cn } from "@/lib/utils";
import { User } from "@/lib/types";
import { LogOut, Menu, X, Bell, ClipboardList, Book, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logoutCurrentUser } from "@/lib/data";

interface HeaderProps {
  user: User | null;
}

const Header = ({ user }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    {
      label: "Announcements",
      href: "/",
      icon: <Bell size={18} />,
    },
    {
      label: "Assignments",
      href: "/assignments",
      icon: <ClipboardList size={18} />,
    },
    {
      label: "Lectures",
      href: "/lectures",
      icon: <Book size={18} />,
    },
    {
      label: "Chat Groups",
      href: "/chat-groups",
      icon: <MessageSquare size={18} />,
    },
  ];

  const handleLogout = () => {
    logoutCurrentUser();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center space-x-2">
            <span className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
              Campus<span className="font-bold">Connect</span>
            </span>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {user && user.name ? (
            <div className="flex items-center space-x-2">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-border"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {user.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user.department}
                </span>
              </div>
            </div>
          ) : null}
          <button
            className="p-2 rounded-full hover:bg-secondary transition-colors"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background md:hidden animate-fade-in">
          <div className="container px-4 py-6 space-y-4 bg-white border shadow-subtle">
            <nav className="bg-white/50 rounded-2xl p-6 flex flex-col space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-2 p-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary"
                    )
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {user && user.name && (
              <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
                <div className="flex items-center space-x-2">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border border-border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.department}
                    </span>
                  </div>
                </div>
                <button
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                  onClick={handleLogout}
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
