import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import AssignmentCard from "@/components/AssignmentCard";
import { currentUser, getAssignmentsForDepartment, semesters } from "@/lib/data";
import { ClipboardX, Plus, GraduationCap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Semester } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Assignments = () => {
  const animationRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<Semester>(
    currentUser.role === "student" && currentUser.semester 
      ? currentUser.semester 
      : "Spring 2024"
  );

  const availableSemesters = (() => {
    switch (currentUser.role) {
      case "student":
        return currentUser.semester ? [currentUser.semester] : [];
      case "teacher":
        return currentUser.associatedSemesters || semesters;
      case "department_admin":
      case "admin":
        return semesters;
      default:
        return semesters;
    }
  })();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setAssignments(getAssignmentsForDepartment(currentUser.department, selectedSemester));
        setIsLoading(false);
      }, 800);
    };

    fetchData();
  }, [selectedSemester]);

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

  const handleSemesterChange = (value: Semester) => {
    if (currentUser.role === "student" && currentUser.semester !== value) {
      toast.error("Students can only view their enrolled semester");
      return;
    }
    setSelectedSemester(value);
    setIsLoading(true);
  };

  const canUploadAssignments = currentUser.role === "teacher" || 
                               currentUser.role === "department_admin" || 
                               currentUser.role === "admin";

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
          <div className="flex items-center gap-4">
            {canUploadAssignments && (
              <Link to="/admin/upload#assignments">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Plus size={16} />
                  <span>Upload Assignment</span>
                </Button>
              </Link>
            )}
            <div className="flex items-center gap-2">
              <GraduationCap size={18} className="text-muted-foreground" />
              <Select 
                value={selectedSemester} 
                onValueChange={handleSemesterChange}
                disabled={currentUser.role === "student"}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {availableSemesters.map(semester => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {assignments.length > 0 ? (
          <div className="space-y-6">
            {assignments.map((assignment, index) => (
              <div 
                key={assignment.id}
                ref={(el) => (animationRefs.current[index] = el)}
                style={{ 
                  transitionDelay: `${index * 50}ms`,
                  transform: "translateY(20px)" 
                }}
              >
                <AssignmentCard 
                  assignment={assignment} 
                  isEditable={canUploadAssignments && assignment.author.id === currentUser.id}
                />
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
              There are currently no assignments for your department in the {selectedSemester} semester.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Assignments;
