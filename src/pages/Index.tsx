
import { useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import AnnouncementCard from "@/components/AnnouncementCard";
import { currentUser } from "@/lib/data";
import { BellOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getAnnouncements } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const animationRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements', currentUser.department],
    queryFn: () => getAnnouncements(currentUser.department),
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

    if (!isLoading && announcements) {
      animationRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }

    return () => {
      animationRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [isLoading, announcements]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-semibold">Announcements</h1>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full p-5 rounded-2xl bg-white/50">
                <Skeleton className="h-6 w-1/4 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
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
          <h1 className="text-3xl font-semibold">Announcements</h1>
        </div>

        {announcements && announcements.length > 0 ? (
          <div className="space-y-6">
            {announcements.map((announcement, index) => (
              <div 
                key={announcement.id}
                ref={(el) => (animationRefs.current[index] = el)}
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
