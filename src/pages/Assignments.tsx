
import { useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import AssignmentCard from "@/components/AssignmentCard";
import { currentUser, getAssignmentsForDepartment } from "@/lib/data";
import { ClipboardX } from "lucide-react";

const Assignments = () => {
  const animationRefs = useRef<(HTMLDivElement | null)[]>([]);
  const assignments = getAssignmentsForDepartment(currentUser.department);

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

    animationRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      animationRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

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
