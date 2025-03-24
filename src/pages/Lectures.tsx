
import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import LectureCard from "@/components/LectureCard";
import { currentUser, semesters } from "@/lib/data";
import { Calendar, Presentation, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Semester } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getLectures } from "@/lib/api";

const Lectures = () => {
  const animationRefs = useRef<(HTMLDivElement | null)[]>([]);
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

  const { data: lectures, isLoading } = useQuery({
    queryKey: ['lectures', currentUser.department, selectedSemester],
    queryFn: () => getLectures(currentUser.department, selectedSemester),
  });

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

    if (!isLoading && lectures) {
      animationRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }

    return () => {
      animationRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [isLoading, lectures]);

  const handleSemesterChange = (value: Semester) => {
    if (currentUser.role === "student" && currentUser.semester !== value) {
      toast.error("Students can only view their enrolled semester");
      return;
    }
    setSelectedSemester(value);
  };

  const canUploadLectures = currentUser.role === "teacher" || 
                           currentUser.role === "department_admin" || 
                           currentUser.role === "admin";

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-semibold">Lectures</h1>
            <div className="text-sm text-muted-foreground">
              Loading...
            </div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full p-5 rounded-2xl bg-white/50">
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

  // Group lectures by date
  const lecturesByDate = lectures?.reduce((acc, lecture) => {
    if (!acc[lecture.date]) {
      acc[lecture.date] = [];
    }
    acc[lecture.date].push(lecture);
    return acc;
  }, {} as Record<string, typeof lectures>);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold">Lectures</h1>
          <div className="flex items-center gap-4">
            {canUploadLectures && (
              <Link to="/admin/upload#lectures">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Plus size={16} />
                  <span>Upload Lecture</span>
                </Button>
              </Link>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-muted-foreground" />
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

        {lectures && lectures.length > 0 ? (
          <div className="space-y-8">
            {lecturesByDate && Object.entries(lecturesByDate).map(([date, dateLectures], dateIndex) => (
              <div key={date} className="space-y-4">
                <div className="bg-muted/50 px-4 py-2 rounded-lg inline-flex items-center gap-2">
                  <Calendar size={16} className="text-muted-foreground" />
                  <span className="font-medium">{date}</span>
                </div>
                <div className="space-y-4">
                  {dateLectures.map((lecture, lectureIndex) => (
                    <div 
                      key={lecture.id}
                      ref={(el) => (animationRefs.current[dateIndex * 10 + lectureIndex] = el)}
                      style={{ 
                        transitionDelay: `${(dateIndex * 10 + lectureIndex) * 50}ms`,
                        transform: "translateY(20px)" 
                      }}
                    >
                      <LectureCard 
                        lecture={lecture} 
                        isEditable={canUploadLectures && 
                          (lecture.professor.id === currentUser.id || 
                            currentUser.role === "department_admin" || 
                            currentUser.role === "admin")}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-white/50 rounded-2xl p-12 shadow-subtle">
            <div className="p-4 bg-muted rounded-full">
              <Presentation size={24} className="text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-medium">No lectures scheduled</h3>
            <p className="mt-2 text-center text-muted-foreground max-w-md">
              There are currently no lectures scheduled for your department in the {selectedSemester} semester.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Lectures;
