
import { Lecture } from "@/lib/types";
import { ClockIcon, FileIcon, MapPinIcon, PencilIcon, Trash2Icon } from "lucide-react";
import DepartmentBadge from "./DepartmentBadge";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import { deleteLecture } from "@/lib/api";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { currentUser } from "@/lib/data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LectureCardProps {
  lecture: Lecture;
  isToday?: boolean;
  isEditable?: boolean;
}

const LectureCard = ({ lecture, isToday = true, isEditable = false }: LectureCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();
  const isAdmin = currentUser.role === "admin";
  const editUrl = isAdmin ? "/admin/upload" : "/manage";

  const deleteMutation = useMutation({
    mutationFn: () => deleteLecture(lecture.id),
    onSuccess: () => {
      toast.success("Lecture deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['lectures'] });
      setShowDeleteDialog(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete lecture");
    },
  });
  const startTime = lecture.startTime || lecture.start_time || "00:00";
  const endTime = lecture.endTime || lecture.end_time || "00:00";
  const lectureDate = new Date(`${lecture.date}T${startTime}`);
  
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
        
        {isEditable && (
          <div className="flex items-center gap-2">
            <Link to={`${editUrl}?edit=lecture&id=${lecture.id}`}>
              <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit lecture">
                <PencilIcon size={16} />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" 
              onClick={() => setShowDeleteDialog(true)}
              disabled={deleteMutation.isPending}
              title="Delete lecture"
            >
              <Trash2Icon size={16} />
            </Button>
          </div>
        )}
      </div>
      
      <p className="mt-2 text-muted-foreground line-clamp-2">{lecture.description}</p>
      
      <div className="mt-4 flex flex-col space-y-2">
        <div className="flex items-center text-xs text-muted-foreground">
          <ClockIcon size={14} className="mr-1.5" />
          <span>
            {isToday 
              ? `${startTime} - ${endTime}` 
              : `${format(lectureDate, 'PPP')} (${startTime} - ${endTime})`
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lecture</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{lecture.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LectureCard;
