
import { Department } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DepartmentBadgeProps {
  department: Department;
  className?: string;
}

const departmentColors: Record<Department, { bg: string; text: string }> = {
  "Computer Science": { bg: "bg-blue-100", text: "text-blue-700" },
  "Electrical Engineering": { bg: "bg-yellow-100", text: "text-yellow-700" },
  "Mechanical Engineering": { bg: "bg-green-100", text: "text-green-700" },
  "Biology": { bg: "bg-emerald-100", text: "text-emerald-700" },
  "Chemistry": { bg: "bg-purple-100", text: "text-purple-700" },
  "Mathematics": { bg: "bg-indigo-100", text: "text-indigo-700" },
  "Physics": { bg: "bg-cyan-100", text: "text-cyan-700" },
  "Business": { bg: "bg-orange-100", text: "text-orange-700" },
  "Economics": { bg: "bg-amber-100", text: "text-amber-700" },
  "Psychology": { bg: "bg-rose-100", text: "text-rose-700" },
};

const DepartmentBadge = ({ department, className }: DepartmentBadgeProps) => {
  const colors = departmentColors[department];
  
  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all",
        colors.bg, 
        colors.text,
        className
      )}
    >
      {department}
    </span>
  );
};

export default DepartmentBadge;
