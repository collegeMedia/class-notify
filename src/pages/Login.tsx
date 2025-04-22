
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockIcon, MailIcon, ShieldIcon } from "lucide-react";
import { currentUser, setCurrentUser } from "@/lib/data";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { UserRole } from "@/lib/types";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Simulate user info with correct UserRole type
      const user = isAdmin
        ? {
            id: "admin-id",
            name: "Admin User",
            email: "admin@university.edu",
            role: "admin" as UserRole,
            department: "Computer Science",
            semester: "Spring 2024",
          }
        : {
            id: "1",
            name: "John Doe",
            email: "john.doe@university.edu",
            role: "student" as UserRole,
            department: "Computer Science",
            semester: "Spring 2024",
          };

      setCurrentUser(user);
      toast({
        title: isAdmin ? "Admin Login Successful" : "Login Successful",
        description: isAdmin
          ? "You've been logged in with admin privileges."
          : "Welcome to the student portal.",
      });
      navigate("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-blue-50/30">
      <div className="glass-card w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
            Campus<span className="font-black">Connect</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to access your student portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                id="email"
                type="email"
                defaultValue="john.doe@university.edu"
                className="glass-input pl-10 w-full py-2"
                placeholder="you@university.edu"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                id="password"
                type="password"
                defaultValue="password123"
                className="glass-input pl-10 w-full py-2"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                defaultChecked
              />
              <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </a>
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Switch
              id="admin-mode"
              checked={isAdmin}
              onCheckedChange={setIsAdmin}
            />
            <label htmlFor="admin-mode" className="text-sm font-medium flex items-center gap-1">
              <ShieldIcon className="h-4 w-4 text-amber-500" />
              Login as Admin
            </label>
            <Popover>
              <PopoverTrigger className="text-muted-foreground ml-1">
                <div className="rounded-full bg-muted h-4 w-4 text-xs flex items-center justify-center">?</div>
              </PopoverTrigger>
              <PopoverContent className="text-xs max-w-[200px]">
                Enable this option to log in with administrator privileges, which allows
                you to upload and manage institutional data.
              </PopoverContent>
            </Popover>
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 px-4 rounded-xl ${isAdmin ? "bg-amber-500 hover:bg-amber-600" : "bg-primary hover:bg-primary/90"} text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              loading ? "opacity-80 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing In...</span>
              </span>
            ) : (
              `Sign In ${isAdmin ? "as Admin" : ""}`
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="#" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
