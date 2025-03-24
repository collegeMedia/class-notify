
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { getChatGroupsForStudent, getChatGroupsForTeacher, getSubjects } from "@/lib/api";
import { currentUser } from "@/lib/data";
import { ChatGroup, Subject } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewChatGroupModal from "@/components/chat/NewChatGroupModal";

const ChatGroups = () => {
  const navigate = useNavigate();
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  
  // Fetch chat groups based on user role
  const { data: chatGroups, isLoading } = useQuery({
    queryKey: ['chatGroups', currentUser.id, currentUser.role],
    queryFn: () => {
      if (currentUser.role === 'teacher') {
        return getChatGroupsForTeacher(currentUser.id);
      } else if (currentUser.role === 'student') {
        return getChatGroupsForStudent(currentUser.id);
      }
      return Promise.resolve([]);
    },
    enabled: !!currentUser.id,
  });

  // Fetch subjects for teacher to create new chat groups
  const { data: subjects } = useQuery({
    queryKey: ['subjects', currentUser.department],
    queryFn: () => getSubjects(currentUser.department),
    enabled: currentUser.role === 'teacher',
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-semibold">Chat Groups</h1>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 rounded-lg bg-white/50 shadow-subtle">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold">Chat Groups</h1>
          
          {currentUser.role === 'teacher' && (
            <Button onClick={() => setIsNewGroupModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> New Chat Group
            </Button>
          )}
        </div>

        {chatGroups && chatGroups.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {chatGroups.map((group) => (
              <div
                key={group.id}
                className="p-6 rounded-lg bg-white/50 shadow-subtle hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/chat/${group.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{group.name}</h3>
                    <p className="text-sm text-muted-foreground">{group.semester}</p>
                  </div>
                  <MessageSquare className="text-primary h-5 w-5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/50 rounded-lg shadow-subtle">
            <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Chat Groups</h3>
            <p className="text-muted-foreground mb-6">
              {currentUser.role === 'teacher' 
                ? "Create a new chat group for your subjects to communicate with your students."
                : "You don't have any chat groups yet. Your teachers will create them."}
            </p>
            
            {currentUser.role === 'teacher' && (
              <Button onClick={() => setIsNewGroupModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create Chat Group
              </Button>
            )}
          </div>
        )}
      </div>

      {currentUser.role === 'teacher' && subjects && (
        <NewChatGroupModal
          isOpen={isNewGroupModalOpen}
          onClose={() => setIsNewGroupModalOpen(false)}
          subjects={subjects}
          teacherId={currentUser.id}
        />
      )}
    </Layout>
  );
};

export default ChatGroups;
