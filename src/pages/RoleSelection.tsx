import { useNavigate } from "react-router-dom";
import { GraduationCap, BookOpen, ShieldCheck } from "lucide-react";

const RoleSelection = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: "Student",
      description: "Access your assignments, lectures, and announcements",
      icon: <GraduationCap size={48} />,
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      route: "/login/student",
    },
    {
      title: "Teacher",
      description: "Manage courses, lectures, and student interactions",
      icon: <BookOpen size={48} />,
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
      route: "/login/teacher",
    },
    {
      title: "Admin",
      description: "Full system access and management capabilities",
      icon: <ShieldCheck size={48} />,
      color: "from-amber-500 to-amber-600",
      hoverColor: "hover:from-amber-600 hover:to-amber-700",
      route: "/login/admin",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-blue-50/30">
      <div className="w-full max-w-4xl animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400 mb-2">
            Campus<span className="font-black">Connect</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Select your role to continue
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <button
              key={role.title}
              onClick={() => navigate(role.route)}
              className={`group relative overflow-hidden rounded-2xl bg-white p-8 shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-4 rounded-full bg-gradient-to-br ${role.color} ${role.hoverColor} text-white transition-all duration-300`}>
                  {role.icon}
                </div>
                <h2 className="text-2xl font-semibold">{role.title}</h2>
                <p className="text-muted-foreground text-sm">
                  {role.description}
                </p>
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Having trouble logging in?{" "}
            <a href="#" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
