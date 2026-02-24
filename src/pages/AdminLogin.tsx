import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LockIcon, MailIcon, ShieldCheck, ArrowLeft } from "lucide-react";
import { setCurrentUser } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { login, setToken } from "@/lib/auth";
import { getCurrentUser } from "@/lib/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formState, setFormState] = useState({
    email: "admin@university.edu",
    password: "admin123",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tokens = await login({
        email: formState.email,
        password: formState.password,
      });

      setToken(tokens.access_token);
      const user = await getCurrentUser();

      if (user.role !== "admin") {
        setLoading(false);
        toast({
          title: "Access Denied",
          description: "You don't have administrator privileges.",
          variant: "destructive",
        });
        return;
      }

      setCurrentUser(user);
      
      toast({
        title: "Admin Login Successful",
        description: "You've been logged in with admin privileges.",
      });
      
      navigate("/");
    } catch (error) {
      setLoading(false);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Incorrect email or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-amber-50/30">
      <div className="glass-card w-full max-w-md p-8 animate-fade-in border-2 border-amber-200">
        <Link 
          to="/login" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to role selection
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-amber-100 text-amber-600 mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold">Admin Portal</h1>
          <p className="text-muted-foreground mt-2">
            Administrator access with full system privileges
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
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                className="glass-input pl-10 w-full py-2"
                placeholder="admin@university.edu"
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
                name="password"
                type="password"
                value={formState.password}
                onChange={handleChange}
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
                className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                defaultChecked
              />
              <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-amber-600 hover:text-amber-700 transition-colors">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
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
              "Sign In as Admin"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Need assistance?{" "}
            <a href="#" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Contact IT support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
