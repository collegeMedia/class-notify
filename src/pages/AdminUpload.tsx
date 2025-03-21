
import { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Users, Bell, ClipboardList, Building, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StudentUploadForm from "@/components/admin/StudentUploadForm";
import AnnouncementUploadForm from "@/components/admin/AnnouncementUploadForm";
import AssignmentUploadForm from "@/components/admin/AssignmentUploadForm";
import DepartmentUploadForm from "@/components/admin/DepartmentUploadForm";
import LectureUploadForm from "@/components/admin/LectureUploadForm";

const AdminUpload = () => {
  const [activeTab, setActiveTab] = useState("students");
  const { toast } = useToast();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Admin Upload Center</h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage institutional data
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              <span>Data Upload</span>
            </CardTitle>
            <CardDescription>
              Use these forms to upload and manage various types of university data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 w-full grid grid-cols-5">
                <TabsTrigger value="students" className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> Students
                </TabsTrigger>
                <TabsTrigger value="announcements" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" /> Announcements
                </TabsTrigger>
                <TabsTrigger value="assignments" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" /> Assignments
                </TabsTrigger>
                <TabsTrigger value="departments" className="flex items-center gap-2">
                  <Building className="h-4 w-4" /> Departments
                </TabsTrigger>
                <TabsTrigger value="lectures" className="flex items-center gap-2">
                  <Book className="h-4 w-4" /> Lectures
                </TabsTrigger>
              </TabsList>

              <TabsContent value="students">
                <StudentUploadForm />
              </TabsContent>
              
              <TabsContent value="announcements">
                <AnnouncementUploadForm />
              </TabsContent>
              
              <TabsContent value="assignments">
                <AssignmentUploadForm />
              </TabsContent>
              
              <TabsContent value="departments">
                <DepartmentUploadForm />
              </TabsContent>
              
              <TabsContent value="lectures">
                <LectureUploadForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminUpload;
