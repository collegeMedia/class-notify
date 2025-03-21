
import { useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import AssignmentCard from "@/components/AssignmentCard";
import { currentUser, getAssignmentsForDepartment } from "@/lib/data";
import { ClipboardX } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const Assignments = () => {
  const animationRefs = useRef<(HTMLDivElement | null)[]>([]);
  const assignments = getAssignmentsForDepartment(currentUser.department);
  const isLoading = false; // In a real app, this would be from a data fetching hook

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (!isLoading) {
      animationRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }

    return () => {
      animationRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [isLoading]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-semibold">Assignments</h1>
            <div className="text-sm text-muted-foreground">
              Loading...
            </div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full bg-white/50 rounded-2xl p-5">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-5 w-64" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-3/4 mt-4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold">Assignments</h1>
          <div className="text-sm text-muted-foreground">
            {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
          </div>
        </div>

        {assignments.length > 0 ? (
          <div className="space-y-6">
            {assignments.map((assignment, index) => (
              <div 
                key={assignment.id}
                ref={(el) => (animationRefs.current[index] = el)}
                className="opacity-0"
                style={{ 
                  transitionDelay: `${index * 50}ms`,
                  transform: "translateY(20px)" 
                }}
              >
                <AssignmentCard assignment={assignment} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-white/50 rounded-2xl p-12 shadow-subtle">
            <div className="p-4 bg-muted rounded-full">
              <ClipboardX size={24} className="text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-medium">No assignments</h3>
            <p className="mt-2 text-center text-muted-foreground max-w-md">
              There are currently no assignments for your department.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Assignments;
