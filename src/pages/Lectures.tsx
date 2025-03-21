
import { useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import LectureCard from "@/components/LectureCard";
import { currentUser, getTodayLectures, getSubjectsForDepartment } from "@/lib/data";
import { BookX } from "lucide-react";

const Lectures = () => {
  const animationRefs = useRef<(HTMLDivElement | null)[]>([]);
  const todayLectures = getTodayLectures(currentUser.department);
  const subjects = getSubjectsForDepartment(currentUser.department);

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
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Today's Lectures</h1>
          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {todayLectures.length > 0 ? (
          <div className="space-y-6 mb-12">
            {todayLectures.map((lecture, index) => (
              <div 
                key={lecture.id}
                ref={(el) => (animationRefs.current[index] = el)}
                className="opacity-0"
                style={{ 
                  transitionDelay: `${index * 50}ms`,
                  transform: "translateY(20px)" 
                }}
              >
                <LectureCard lecture={lecture} />
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
              There are no scheduled lectures for your department today.
            </p>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-6 mt-12">Semester Subjects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {subjects.map((subject, index) => (
            <div 
              key={subject.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-subtle hover:shadow-elevation-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-medium text-muted-foreground">{subject.code}</div>
                  <h3 className="text-lg font-medium mt-1">{subject.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {subject.description}
                  </p>
                </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Professor: {subject.professor.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Lectures;
