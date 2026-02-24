import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Book, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AssignmentUploadForm from "@/components/admin/AssignmentUploadForm";
import LectureUploadForm from "@/components/admin/LectureUploadForm";

const TeacherManage = () => {
  const [searchParams] = useSearchParams();
  const editType = searchParams.get("edit");
  const editId = searchParams.get("id");
  
  const [activeTab, setActiveTab] = useState("assignments");
  const { toast } = useToast();

  useEffect(() => {
    if (editType === "assignment") {
      setActiveTab("assignments");
    } else if (editType === "lecture") {
      setActiveTab("lectures");
    }
  }, [editType]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Manage Content</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage assignments and lectures for your subjects
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              <span>Content Management</span>
            </CardTitle>
            <CardDescription>
              Create and edit assignments and lectures for the subjects you teach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 w-full grid grid-cols-2">
                <TabsTrigger value="assignments" className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" /> Assignments
                </TabsTrigger>
                <TabsTrigger value="lectures" className="flex items-center gap-2">
                  <Book className="h-4 w-4" /> Lectures
                </TabsTrigger>
              </TabsList>

              <TabsContent value="assignments">
                <AssignmentUploadForm editId={editType === "assignment" ? editId : undefined} />
              </TabsContent>
              
              <TabsContent value="lectures">
                <LectureUploadForm editId={editType === "lecture" ? editId : undefined} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TeacherManage;
