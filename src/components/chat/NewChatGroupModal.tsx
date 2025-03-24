
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Subject, Semester } from "@/lib/types";
import { createChatGroup } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface NewChatGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  teacherId: string;
}

const NewChatGroupModal = ({ isOpen, onClose, subjects, teacherId }: NewChatGroupModalProps) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [semester, setSemester] = useState<Semester>("Spring 2024");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subjectId || !semester) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createChatGroup({
        name,
        subject_id: subjectId,
        teacher_id: teacherId,
        semester
      });
      
      queryClient.invalidateQueries({ queryKey: ['chatGroups'] });
      toast.success("Chat group created successfully");
      onClose();
      // Reset form
      setName("");
      setSubjectId("");
    } catch (error) {
      toast.error("Failed to create chat group");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const semesters: Semester[] = ["Fall 2023", "Spring 2024", "Summer 2024", "Fall 2024"];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Chat Group</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select
              value={subjectId}
              onValueChange={setSubjectId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <Select
              value={semester}
              onValueChange={(value) => setSemester(value as Semester)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map((sem) => (
                  <SelectItem key={sem} value={sem}>
                    {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatGroupModal;
