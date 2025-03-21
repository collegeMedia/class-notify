
import { useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import AnnouncementCard from "@/components/AnnouncementCard";
import { currentUser, getAnnouncementsForDepartment } from "@/lib/data";
import { Bell, BellOff } from "lucide-react";

const Index = () => {
  const animationRefs = useRef<(HTMLDivElement | null)[]>([]);
  const announcements = getAnnouncementsForDepartment(currentUser.department);

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
          <h1 className="text-3xl font-semibold">Announcements</h1>
        </div>

        {announcements.length > 0 ? (
          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <div 
                key={announcement.id}
                ref={(el) => (animationRefs.current[index] = el)}
                className="opacity-0"
                style={{ 
                  transitionDelay: `${index * 50}ms`,
                  transform: "translateY(20px)" 
                }}
              >
                <AnnouncementCard 
                  announcement={announcement} 
                  isHighlighted={
                    announcement.department === currentUser.department || 
                    announcement.important
                  } 
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-white/50 rounded-2xl p-12 shadow-subtle">
            <div className="p-4 bg-muted rounded-full">
              <BellOff size={24} className="text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-medium">No announcements</h3>
            <p className="mt-2 text-center text-muted-foreground max-w-md">
              There are currently no announcements for your department or the general student body.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
