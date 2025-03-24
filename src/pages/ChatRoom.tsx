
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChatGroupById, getMessages, createMessage } from "@/lib/api";
import { currentUser } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { format } from "date-fns";
import { Send } from "lucide-react";
import { toast } from "sonner";

const ChatRoom = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: chatGroup, isLoading: isLoadingGroup } = useQuery({
    queryKey: ['chatGroup', groupId],
    queryFn: () => getChatGroupById(groupId!),
    enabled: !!groupId,
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', groupId],
    queryFn: () => getMessages(groupId!),
    enabled: !!groupId,
    refetchInterval: 5000, // Poll for new messages every 5 seconds
  });

  const sendMessageMutation = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', groupId] });
      setNewMessage("");
    },
    onError: () => {
      toast.error("Failed to send message");
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    sendMessageMutation.mutate({
      content: newMessage,
      sender_id: currentUser.id,
      chat_group_id: groupId!
    });
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoadingGroup) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <Skeleton className="h-5 w-1/4 mb-8" />
          <div className="bg-white/50 rounded-lg p-6 h-[60vh]">
            <Skeleton className="h-full w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!chatGroup) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Chat group not found</h2>
          <p className="text-muted-foreground">The chat group you're looking for doesn't exist or you don't have access.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">{chatGroup.name}</h1>
          <p className="text-muted-foreground">
            {chatGroup.semester} • Created by {chatGroup.teacher.name}
          </p>
        </div>

        {/* Chat messages container */}
        <div className="bg-white/50 rounded-lg shadow-subtle p-4 h-[60vh] flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 p-2">
            {isLoadingMessages ? (
              <div className="h-full flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : messages && messages.length > 0 ? (
              <>
                {messages.map((message) => {
                  const isCurrentUser = message.sender.id === currentUser.id;
                  return (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isCurrentUser 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary'
                        }`}
                      >
                        {!isCurrentUser && (
                          <p className="text-xs font-medium mb-1">{message.sender.name}</p>
                        )}
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
              </div>
            )}
          </div>

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={sendMessageMutation.isPending}
            />
            <Button type="submit" disabled={sendMessageMutation.isPending || !newMessage.trim()}>
              {sendMessageMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Send size={18} />
              )}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ChatRoom;
