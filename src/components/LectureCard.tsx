
import { Lecture } from "@/lib/types";
import { ClockIcon, FileIcon, MapPinIcon } from "lucide-react";
import DepartmentBadge from "./DepartmentBadge";
import { format } from "date-fns";

interface LectureCardProps {
  lecture: Lecture;
  isToday?: boolean;
}

const LectureCard = ({ lecture, isToday = true }: LectureCardProps) => {
  const lectureDate = new Date(`${lecture.date}T${lecture.startTime}`);
  
  return (
    <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-subtle hover:shadow-elevation-1 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <DepartmentBadge department={lecture.department} />
            <span className="text-xs text-muted-foreground">{lecture.subject}</span>
            
            {isToday && (
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                Today
              </span>
            )}
          </div>
          <h3 className="text-lg font-medium">{lecture.title}</h3>
        </div>
      </div>
      
      <p className="mt-2 text-muted-foreground line-clamp-2">{lecture.description}</p>
      
      <div className="mt-4 flex flex-col space-y-2">
        <div className="flex items-center text-xs text-muted-foreground">
          <ClockIcon size={14} className="mr-1.5" />
          <span>
            {isToday 
              ? `${lecture.startTime} - ${lecture.endTime}` 
              : `${format(lectureDate, 'PPP')} (${lecture.startTime} - ${lecture.endTime})`
            }
          </span>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <MapPinIcon size={14} className="mr-1.5" />
          <span>{lecture.location}</span>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <span>Professor: {lecture.professor.name}</span>
        </div>
      </div>
      
      {lecture.materials && lecture.materials.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="text-xs font-medium mb-2">Materials:</div>
          <div className="flex flex-wrap gap-2">
            {lecture.materials.map((material, index) => (
              <div 
                key={index}
                className="flex items-center px-2 py-1 bg-secondary rounded-md text-xs"
              >
                <FileIcon size={12} className="mr-1.5" />
                {material}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LectureCard;
