
import { Announcement } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import DepartmentBadge from "./DepartmentBadge";
import { MegaphoneIcon } from "lucide-react";

interface AnnouncementCardProps {
  announcement: Announcement;
  isHighlighted?: boolean;
}

const AnnouncementCard = ({ announcement, isHighlighted = false }: AnnouncementCardProps) => {
  const date = new Date(announcement.createdAt);
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });

  return (
    <div 
      className={`
        w-full p-5 rounded-2xl transition-all duration-300 
        ${isHighlighted 
          ? 'bg-white shadow-elevation-2 border border-primary/10 scale-[1.02]' 
          : 'bg-white/70 shadow-subtle hover:shadow-elevation-1 hover:bg-white'}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex space-x-2 items-center">
          {announcement.important && (
            <div className="text-red-500">
              <MegaphoneIcon size={16} />
            </div>
          )}
          {announcement.department && (
            <DepartmentBadge department={announcement.department} />
          )}
          <span className="text-muted-foreground text-xs">{timeAgo}</span>
        </div>
      </div>
      
      <div className="mt-3">
        <h3 className={`text-lg font-medium ${announcement.important ? 'text-primary' : ''}`}>
          {announcement.title}
        </h3>
        <p className="mt-2 text-muted-foreground line-clamp-3">
          {announcement.content}
        </p>
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        {announcement.author.avatar && (
          <img 
            src={announcement.author.avatar}
            alt={announcement.author.name}
            className="w-6 h-6 rounded-full border border-border"
          />
        )}
        <span className="text-xs text-muted-foreground">{announcement.author.name}</span>
      </div>
    </div>
  );
};

export default AnnouncementCard;
