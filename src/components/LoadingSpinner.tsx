
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const LoadingSpinner = ({ className, size = "md" }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div
        className={cn(
          "border-primary border-t-transparent rounded-full animate-spin",
          sizeClasses[size]
        )}
      />
    </div>
  );
};

export default LoadingSpinner;
