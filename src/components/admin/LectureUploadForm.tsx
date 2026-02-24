
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
import { CalendarIcon, Clock, Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { semesters, subjects, users, currentUser } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { useDepartments } from "@/hooks/use-departments";
import { createLecture, updateLecture, getLectureById, getSubjectsByProfessor } from "@/lib/api";
import { Subject } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  date: z.date({
    required_error: "Lecture date is required.",
  }),
  startTime: z.string().min(1, {
    message: "Start time is required.",
  }),
  endTime: z.string().min(1, {
    message: "End time is required.",
  }),
  location: z.string().min(1, {
    message: "Location is required.",
  }),
  department: z.string().min(1, {
    message: "Please select a department.",
  }),
  subject: z.string().min(1, {
    message: "Please select a subject.",
  }),
  professorId: z.string().min(1, {
    message: "Please select a professor.",
  }),
  materials: z.string().optional(),
  semester: z.string().min(1, {
    message: "Please select a semester.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface LectureUploadFormProps {
  editId?: string | null;
}

const LectureUploadForm = ({ editId }: LectureUploadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const { toast } = useToast();
  const { departments, isLoading: isDepartmentsLoading } = useDepartments();
  
  const isTeacher = currentUser.role === "professor" || currentUser.role === "teacher";
  const isAdmin = currentUser.role === "admin";
  const isEditMode = !!editId;
  
  const { data: existingLecture, isLoading: isLoadingLecture } = useQuery({
    queryKey: ['lecture', editId],
    queryFn: () => getLectureById(editId!),
    enabled: !!editId,
  });
  
  const { data: teacherSubjects, isLoading: isLoadingTeacherSubjects } = useQuery({
    queryKey: ['teacherSubjects', currentUser.id],
    queryFn: () => getSubjectsByProfessor(currentUser.id),
    enabled: isTeacher && !isAdmin,
  });

  // Filter subjects based on selected department, semester, and user role
  const filteredSubjects = isTeacher && !isAdmin && teacherSubjects
    ? teacherSubjects.filter(
        (subject) => 
          subject.department === selectedDepartment && 
          (!selectedSemester || subject.semester === selectedSemester)
      )
    : subjects.filter(
        (subject) => 
          subject.department === selectedDepartment && 
          (!selectedSemester || subject.semester === selectedSemester)
      );

  // Filter users who can be professors (teachers)
  const professors = users.filter(
    (user) => user.role === "teacher" && (
      !selectedDepartment || user.department === selectedDepartment
    )
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: undefined,
      startTime: "",
      endTime: "",
      location: "",
      department: "",
      subject: "",
      professorId: "",
      materials: "",
      semester: "",
    },
  });

  useEffect(() => {
    if (existingLecture) {
      form.reset({
        title: existingLecture.title,
        description: existingLecture.description,
        date: existingLecture.date ? parse(existingLecture.date, "yyyy-MM-dd", new Date()) : undefined,
        startTime: existingLecture.startTime || existingLecture.start_time || "",
        endTime: existingLecture.endTime || existingLecture.end_time || "",
        location: existingLecture.location,
        department: existingLecture.department,
        subject: existingLecture.subject,
        professorId: existingLecture.professor.id,
        materials: existingLecture.materials?.join(", ") || "",
        semester: existingLecture.semester,
      });
      setSelectedDepartment(existingLecture.department);
      setSelectedDepartmentId(existingLecture.department_id || "");
      setSelectedSemester(existingLecture.semester);
    }
  }, [existingLecture, form]);

  // Handle department change to reset dependent fields
  const handleDepartmentChange = (value: string) => {
    const dept = departments.find(d => d.code === value);
    setSelectedDepartment(dept?.name || value);
    setSelectedDepartmentId(dept?.id || "");
    form.setValue("department", dept?.code || value);
    form.setValue("subject", "");
    form.setValue("professorId", "");
  };

  // Handle semester change to reset subject if needed
  const handleSemesterChange = (value: string) => {
    setSelectedSemester(value);
    form.setValue("semester", value);
    
    const currentSubject = form.getValues("subject");
    const subjectExists = filteredSubjects.some(subject => subject.name === currentSubject);
    
    if (!subjectExists) {
      form.setValue("subject", "");
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      const lectureData = {
        title: data.title,
        description: data.description,
        date: format(data.date, "yyyy-MM-dd"),
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        department: data.department,
        department_id: selectedDepartmentId || undefined,
        subject: data.subject,
        professor: users.find(u => u.id === data.professorId)!,
        materials: data.materials ? data.materials.split(",").map(m => m.trim()) : undefined,
        semester: data.semester,
      };

      if (isEditMode && editId) {
        await updateLecture(editId, lectureData);
        toast({
          title: "Lecture updated",
          description: `Lecture "${data.title}" has been successfully updated.`,
        });
      } else {
        await createLecture(lectureData);
        toast({
          title: "Lecture scheduled",
          description: `Lecture "${data.title}" has been successfully scheduled for ${data.semester}.`,
        });
        form.reset();
        setSelectedDepartment("");
        setSelectedDepartmentId("");
        setSelectedSemester("");
      }
    } catch (error) {
      let errorMessage = "Failed to schedule lecture";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        if (error.message.includes("403") || error.message.includes("permission")) {
          errorMessage = "You don't have permission to create lectures for this subject. You can only create lectures for subjects you teach.";
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
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
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester</FormLabel>
                <Select
                  onValueChange={handleSemesterChange}
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
        </div>
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lecture Title</FormLabel>
              <FormControl>
                <Input placeholder="Introduction to Neural Networks" {...field} />
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
              <FormLabel>Lecture Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter the details and topics to be covered in this lecture..."
                  className="min-h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Lecture Date</FormLabel>
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
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Room 301, Building A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedDepartment || !selectedSemester}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={
                        !selectedDepartment 
                          ? "Select a department first" 
                          : !selectedSemester 
                            ? "Select a semester first"
                            : "Select a subject"
                      } />
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
            name="professorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professor</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={!selectedDepartment}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={selectedDepartment ? "Select a professor" : "Select a department first"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {professors.map((professor) => (
                      <SelectItem key={professor.id} value={professor.id}>
                        {professor.name}
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
            name="materials"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lecture Materials (Optional)</FormLabel>
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
          <Button type="submit" disabled={isSubmitting || isLoadingLecture}>
            {isSubmitting ? (isEditMode ? "Updating..." : "Scheduling...") : (isEditMode ? "Update Lecture" : "Schedule Lecture")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LectureUploadForm;
