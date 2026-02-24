
import { Assignment } from "@/lib/types";
import { CalendarIcon, ClockIcon, FileIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import DepartmentBadge from "./DepartmentBadge";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import { deleteAssignment } from "@/lib/api";
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

interface AssignmentCardProps {
  assignment: Assignment;
  isEditable?: boolean;
}

const AssignmentCard = ({ assignment, isEditable = false }: AssignmentCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();
  const isAdmin = currentUser.role === "admin";
  const editUrl = isAdmin ? "/admin/upload" : "/manage";

  const deleteMutation = useMutation({
    mutationFn: () => deleteAssignment(assignment.id),
    onSuccess: () => {
      toast.success("Assignment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      setShowDeleteDialog(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete assignment");
    },
  });
  const dueDateString = assignment.dueDate || assignment.due_date || new Date().toISOString();
  const createdDateString = assignment.createdAt || assignment.created_at || new Date().toISOString();
  const dueDate = new Date(dueDateString);
  const createdDate = new Date(createdDateString);
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
        
        <div className="flex items-center gap-2">
          {isEditable && (
            <>
              <Link to={`${editUrl}?edit=assignment&id=${assignment.id}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit assignment">
                  <PencilIcon size={16} />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" 
                onClick={() => setShowDeleteDialog(true)}
                disabled={deleteMutation.isPending}
                title="Delete assignment"
              >
                <Trash2Icon size={16} />
              </Button>
            </>
          )}
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isOverdue 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {isOverdue ? 'Overdue' : 'Active'}
          </div>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assignment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{assignment.title}"? This action cannot be undone.
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

export default AssignmentCard;
