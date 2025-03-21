
import { Assignment } from "@/lib/types";
import { CalendarIcon, ClockIcon, FileIcon } from "lucide-react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import DepartmentBadge from "./DepartmentBadge";

interface AssignmentCardProps {
  assignment: Assignment;
}

const AssignmentCard = ({ assignment }: AssignmentCardProps) => {
  const dueDate = new Date(assignment.dueDate);
  const createdDate = new Date(assignment.createdAt);
  const isOverdue = isPast(dueDate);
  const timeLeft = formatDistanceToNow(dueDate, { addSuffix: true });
  
  return (
    <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-subtle hover:shadow-elevation-1 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <DepartmentBadge department={assignment.department} />
            <span className="text-xs text-muted-foreground">{assignment.subject}</span>
          </div>
          <h3 className="text-lg font-medium">{assignment.title}</h3>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isOverdue 
            ? 'bg-red-100 text-red-700' 
            : 'bg-green-100 text-green-700'
        }`}>
          {isOverdue ? 'Overdue' : 'Active'}
        </div>
      </div>
      
      <p className="mt-3 text-muted-foreground line-clamp-2">{assignment.description}</p>
      
      <div className="mt-4 flex flex-col space-y-2">
        <div className="flex items-center text-xs text-muted-foreground">
          <CalendarIcon size={14} className="mr-1.5" />
          <span>Due: {format(dueDate, 'PPP')} ({timeLeft})</span>
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground">
          <ClockIcon size={14} className="mr-1.5" />
          <span>Created: {format(createdDate, 'PPP')}</span>
        </div>
      </div>
      
      {assignment.attachments && assignment.attachments.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="text-xs font-medium mb-2">Attachments:</div>
          <div className="flex flex-wrap gap-2">
            {assignment.attachments.map((attachment, index) => (
              <div 
                key={index}
                className="flex items-center px-2 py-1 bg-secondary rounded-md text-xs"
              >
                <FileIcon size={12} className="mr-1.5" />
                {attachment}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;
