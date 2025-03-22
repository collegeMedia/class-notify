
import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import LectureCard from "@/components/LectureCard";
import { currentUser, getTodayLectures, getSubjectsForDepartment, semesters } from "@/lib/data";
import { BookX, Calendar, Clock, Search, GraduationCap, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lecture, Semester, Subject } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Lectures = () => {
  const animationRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [todayLectures, setTodayLectures] = useState<Lecture[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("today");
  const [selectedSemester, setSelectedSemester] = useState<Semester>(
    currentUser.role === "student" && currentUser.semester 
      ? currentUser.semester 
      : "Spring 2024"
  );
  
  // Determine available semesters based on user role
  const availableSemesters = (() => {
    switch (currentUser.role) {
      case "student":
        // Students can only view their enrolled semester
        return currentUser.semester ? [currentUser.semester] : [];
      case "teacher":
        // Teachers can view semesters they are associated with
        return currentUser.associatedSemesters || semesters;
      case "department_admin":
      case "admin":
        // Admins can view all semesters
        return semesters;
      default:
        return semesters;
    }
  })();

  useEffect(() => {
    // Simulate API fetch delay
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, these would be API calls
        setTimeout(() => {
          setTodayLectures(getTodayLectures(currentUser.department, selectedSemester));
          setSubjects(getSubjectsForDepartment(currentUser.department, selectedSemester));
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching lectures:", error);
        setIsLoading(false);
      }
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

  // Filter subjects based on search query
  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle semester change
  const handleSemesterChange = (value: Semester) => {
    if (currentUser.role === "student" && currentUser.semester !== value) {
      toast.error("Students can only view their enrolled semester");
      return;
    }
    setSelectedSemester(value);
    setIsLoading(true);
  };

  // Show upload button for teachers and admins
  const canUploadLectures = currentUser.role === "teacher" || 
                          currentUser.role === "department_admin" || 
                          currentUser.role === "admin";

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-semibold">Lectures & Subjects</h1>
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
          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full grid grid-cols-2">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Today's Schedule
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> All Subjects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            {isLoading ? (
              <div className="py-12">
                <LoadingSpinner />
              </div>
            ) : todayLectures.length > 0 ? (
              <div className="space-y-6 mb-12">
                {todayLectures.map((lecture, index) => (
                  <div 
                    key={lecture.id}
                    ref={(el) => (animationRefs.current[index] = el)}
                    style={{ 
                      transitionDelay: `${index * 50}ms`,
                      transform: "translateY(20px)" 
                    }}
                  >
                    <LectureCard 
                      lecture={lecture} 
                      isEditable={canUploadLectures && lecture.professor.id === currentUser.id}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white/50 rounded-2xl p-12 shadow-subtle mb-12">
                <div className="p-4 bg-muted rounded-full">
                  <BookX size={24} className="text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-xl font-medium">No lectures today</h3>
                <p className="mt-2 text-center text-muted-foreground max-w-md">
                  There are no scheduled lectures for your department today in the {selectedSemester} semester.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="subjects">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subjects..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="py-12">
                <LoadingSpinner />
              </div>
            ) : filteredSubjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredSubjects.map((subject) => (
                  <div 
                    key={subject.id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-subtle hover:shadow-elevation-1 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="px-2 py-0 text-xs font-medium">
                            {subject.code}
                          </Badge>
                          <Badge 
                            variant="secondary" 
                            className="px-2 py-0 text-xs font-medium"
                          >
                            {subject.credits} credits
                          </Badge>
                        </div>
                        <h3 className="text-lg font-medium mt-2">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                          {subject.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 text-xs flex items-center gap-2">
                      <img 
                        src={subject.professor.avatar || "https://i.pravatar.cc/150"}
                        alt={subject.professor.name}
                        className="w-5 h-5 rounded-full border border-border"
                      />
                      <span className="text-muted-foreground">
                        {subject.professor.name}
                      </span>
                    </div>
                    {subject.prerequisites && subject.prerequisites.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="text-xs text-muted-foreground">
                          Prerequisites: {subject.prerequisites.join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center bg-white/50 rounded-2xl p-12 shadow-subtle mb-12">
                <h3 className="mt-4 text-xl font-medium">No subjects found</h3>
                <p className="mt-2 text-center text-muted-foreground max-w-md">
                  {searchQuery 
                    ? "Try adjusting your search criteria."
                    : `No subjects available for ${currentUser.department} in the ${selectedSemester} semester.`
                  }
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Lectures;
