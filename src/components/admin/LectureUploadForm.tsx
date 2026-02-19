import { useState } from "react";
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
import { departments, semesters, currentUser } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { createLecture, getSubjects, getUsers } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Department, Semester } from "@/lib/types";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  date: z.date({ required_error: "Lecture date is required." }),
  startTime: z.string().min(1, { message: "Start time is required." }),
  endTime: z.string().min(1, { message: "End time is required." }),
  location: z.string().min(1, { message: "Location is required." }),
  department: z.string().min(1, { message: "Please select a department." }),
  semester: z.string().min(1, { message: "Please select a semester." }),
  subject: z.string().min(1, { message: "Please select a subject." }),
  professorId: z.string().min(1, { message: "Please select a professor." }),
  materials: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const LectureUploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", description: "", date: undefined, startTime: "", endTime: "", location: "", department: "", semester: "", subject: "", professorId: "", materials: "" },
  });

  const { data: subjects } = useQuery({
    queryKey: ["subjects", selectedDepartment, selectedSemester],
    queryFn: () => getSubjects(selectedDepartment as Department, selectedSemester as Semester),
    enabled: !!selectedDepartment && !!selectedSemester,
  });

  const { data: allUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const professors = (allUsers ?? []).filter(
    (u) => u.role === "teacher" && (!selectedDepartment || u.department === selectedDepartment)
  );

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    form.setValue("department", value);
    form.setValue("subject", "");
    form.setValue("professorId", "");
  };

  const handleSemesterChange = (value: string) => {
    setSelectedSemester(value);
    form.setValue("semester", value);
    form.setValue("subject", "");
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const materialsArray = data.materials
        ? data.materials.split(",").map((m) => m.trim()).filter(Boolean)
        : [];

      await createLecture({
        title: data.title,
        description: data.description,
        date: format(data.date, "yyyy-MM-dd"),
        start_time: data.startTime,
        end_time: data.endTime,
        location: data.location,
        department: data.department,
        subject: data.subject,
        professor_id: data.professorId,
        materials: materialsArray,
        semester: data.semester,
      });

      queryClient.invalidateQueries({ queryKey: ["lectures"] });
      toast({ title: "Lecture scheduled", description: `Lecture "${data.title}" has been successfully scheduled.` });
      form.reset();
      setSelectedDepartment("");
      setSelectedSemester("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to schedule lecture.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <FormField control={form.control} name="department" render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select onValueChange={handleDepartmentChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select a department" /></SelectTrigger></FormControl>
                <SelectContent>
                  {departments.map((dept) => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="semester" render={({ field }) => (
            <FormItem>
              <FormLabel>Semester</FormLabel>
              <Select onValueChange={handleSemesterChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select a semester" /></SelectTrigger></FormControl>
                <SelectContent>
                  {semesters.map((sem) => <SelectItem key={sem} value={sem}>{sem}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Lecture Title</FormLabel>
            <FormControl><Input placeholder="Introduction to Neural Networks" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Lecture Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter topics to be covered in this lecture..." className="min-h-24" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField control={form.control} name="date" render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Lecture Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="startTime" render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <FormControl><Input type="time" {...field} /></FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="endTime" render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <FormControl><Input type="time" {...field} /></FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="location" render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl><Input placeholder="Room 301, Building A" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="subject" render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedDepartment || !selectedSemester}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={!selectedDepartment ? "Select department first" : !selectedSemester ? "Select semester first" : "Select a subject"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(subjects ?? []).map((s) => <SelectItem key={s.id} value={s.name}>{s.name} ({s.code})</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="professorId" render={({ field }) => (
            <FormItem>
              <FormLabel>Professor</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedDepartment}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={selectedDepartment ? "Select a professor" : "Select a department first"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {professors.map((prof) => <SelectItem key={prof.id} value={prof.id}>{prof.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="materials" render={({ field }) => (
            <FormItem>
              <FormLabel>Lecture Materials (Optional)</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <Input placeholder="Enter URLs separated by commas" {...field} />
                  <Button type="button" size="icon" variant="outline"><Upload className="h-4 w-4" /></Button>
                </div>
              </FormControl>
              <FormDescription>Enter URLs separated by commas</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Scheduling..." : "Schedule Lecture"}</Button>
        </div>
      </form>
    </Form>
  );
};

export default LectureUploadForm;
