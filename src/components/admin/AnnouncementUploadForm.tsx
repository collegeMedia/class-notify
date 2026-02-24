
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { currentUser, semesters } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useDepartments } from "@/hooks/use-departments";
import { createAnnouncement } from "@/lib/api";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  department: z.string().optional(),
  important: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const AnnouncementUploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const { toast } = useToast();
  const { departments, isLoading: isDepartmentsLoading } = useDepartments();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      department: undefined,
      semester: undefined,
      important: false,
    },
  });

  const handleDepartmentChange = (value: string) => {
    const dept = departments.find(d => d.code === value);
    setSelectedDepartmentId(dept?.id || "");
    form.setValue("department", value);
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      await createAnnouncement({
        title: data.title,
        content: data.content,
        author: currentUser,
        department: data.department,
        department_id: selectedDepartmentId || undefined,
        important: data.important,
        semester: data.semester,
      });
      
      toast({
        title: "Announcement published",
        description: "Your announcement has been successfully published.",
      });
      
      form.reset();
      setSelectedDepartmentId("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to publish announcement",
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
              <FormLabel>Announcement Title</FormLabel>
              <FormControl>
                <Input placeholder="Important Campus Update" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Announcement Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter the details of your announcement here..."
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
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department (Optional)</FormLabel>
                <Select 
                  onValueChange={handleDepartmentChange} 
                  defaultValue={field.value}
                  disabled={isDepartmentsLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isDepartmentsLoading ? "Loading..." : "All departments"} />
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
                <FormDescription>
                  Leave empty to send to all departments
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="semester"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Semester (Optional)</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="All semesters" />
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
                <FormDescription>
                  Leave empty for all semesters
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="important"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between space-x-2 rounded-md border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Mark as Important</FormLabel>
                  <FormDescription>
                    Important announcements will be highlighted
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Publishing..." : "Publish Announcement"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AnnouncementUploadForm;
