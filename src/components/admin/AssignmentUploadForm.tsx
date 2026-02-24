
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subjects, semesters, currentUser } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { useDepartments } from "@/hooks/use-departments";
import { createAssignment, updateAssignment, getAssignmentById, getSubjectsByProfessor } from "@/lib/api";
import { Subject } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  dueDate: z.date({
    required_error: "Due date is required.",
  }),
  department: z.string().min(1, {
    message: "Please select a department.",
  }),
  subject: z.string().min(1, {
    message: "Please select a subject.",
  }),
  semester: z.string().min(1, {
    message: "Please select a semester.",
  }),
  attachments: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AssignmentUploadFormProps {
  editId?: string | null;
}

const AssignmentUploadForm = ({ editId }: AssignmentUploadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const { toast } = useToast();
  const { departments, isLoading: isDepartmentsLoading } = useDepartments();
  
  const isTeacher = currentUser.role === "professor" || currentUser.role === "teacher";
  const isAdmin = currentUser.role === "admin";
  const isEditMode = !!editId;
  
  const { data: existingAssignment, isLoading: isLoadingAssignment } = useQuery({
    queryKey: ['assignment', editId],
    queryFn: () => getAssignmentById(editId!),
    enabled: !!editId,
  });
  
  const { data: teacherSubjects, isLoading: isLoadingTeacherSubjects } = useQuery({
    queryKey: ['teacherSubjects', currentUser.id],
    queryFn: () => getSubjectsByProfessor(currentUser.id),
    enabled: isTeacher && !isAdmin,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: undefined,
      department: "",
      subject: "",
      semester: "",
      attachments: "",
    },
  });

  useEffect(() => {
    if (existingAssignment) {
      const dueDateStr = existingAssignment.dueDate || existingAssignment.due_date;
      form.reset({
        title: existingAssignment.title,
        description: existingAssignment.description,
        dueDate: dueDateStr ? parse(dueDateStr, "yyyy-MM-dd", new Date()) : undefined,
        department: existingAssignment.department,
        subject: existingAssignment.subject,
        semester: existingAssignment.semester,
        attachments: existingAssignment.attachments?.join(", ") || "",
      });
      setSelectedDepartment(existingAssignment.department);
      setSelectedDepartmentId(existingAssignment.department_id || "");
    }
  }, [existingAssignment, form]);

  // Filter subjects based on selected department and user role
  const filteredSubjects = isTeacher && !isAdmin && teacherSubjects
    ? teacherSubjects.filter(
        (subject) => subject.department === selectedDepartment
      )
    : subjects.filter(
        (subject) => subject.department === selectedDepartment
      );

  // Handle department change to reset subject field
  const handleDepartmentChange = (value: string) => {
    const dept = departments.find(d => d.code === value);
    setSelectedDepartment(dept?.name || value);
    setSelectedDepartmentId(dept?.id || "");
    form.setValue("department", dept?.code || value);
    form.setValue("subject", "");
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const assignmentData = {
        title: data.title,
        description: data.description,
        dueDate: format(data.dueDate, "yyyy-MM-dd"),
        department: data.department,
        department_id: selectedDepartmentId || undefined,
        subject: data.subject,
        author: currentUser,
        semester: data.semester,
        attachments: data.attachments ? data.attachments.split(",").map(a => a.trim()) : undefined,
      };

      if (isEditMode && editId) {
        await updateAssignment(editId, assignmentData);
        toast({
          title: "Assignment updated",
          description: `Assignment "${data.title}" has been successfully updated.`,
        });
      } else {
        await createAssignment(assignmentData);
        toast({
          title: "Assignment created",
          description: `Assignment "${data.title}" has been successfully created.`,
        });
        form.reset();
        setSelectedDepartment("");
        setSelectedDepartmentId("");
      }
    } catch (error) {
      let errorMessage = "Failed to create assignment";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        if (error.message.includes("403") || error.message.includes("permission")) {
          errorMessage = "You don't have permission to create assignments for this subject. You can only create assignments for subjects you teach.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignment Title</FormLabel>
              <FormControl>
                <Input placeholder="Midterm Project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assignment Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter the details and requirements for this assignment..."
                  className="min-h-32"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <Select
                  onValueChange={handleDepartmentChange}
                  defaultValue={field.value}
                  disabled={isDepartmentsLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isDepartmentsLoading ? "Loading..." : "Select a department"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.code}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedDepartment}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedDepartment ? "Select a subject" : "Select a department first"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.name}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a semester" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="attachments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attachments (Optional)</FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                    <Input placeholder="Upload files or enter URLs" {...field} />
                    <Button type="button" size="icon" variant="outline">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>
                  Enter URLs separated by commas or upload files
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || isLoadingAssignment}>
            {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Assignment" : "Create Assignment")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AssignmentUploadForm;
