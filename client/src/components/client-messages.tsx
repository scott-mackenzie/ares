import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare, Send, Reply, Clock, User, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ClientMessages() {
  const [newMessageDialog, setNewMessageDialog] = useState(false);
  const [messageForm, setMessageForm] = useState({
    subject: "",
    message: "",
    priority: "normal" as "low" | "normal" | "high" | "urgent",
  });
  const [replyForm, setReplyForm] = useState({ messageId: "", reply: "" });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock messages data - in real app this would come from API
  const messages = [
    {
      id: 1,
      subject: "Security Assessment Update",
      message: "Your penetration testing assessment is now complete. Please review the findings in your reports section.",
      sender: "Security Team",
      senderType: "admin",
      timestamp: "2024-01-15 14:30",
      priority: "high",
      status: "unread",
      replies: [],
    },
    {
      id: 2,
      subject: "Vulnerability Remediation Status",
      message: "We've reviewed your remediation efforts for the SQL injection vulnerability. Great progress!",
      sender: "John Smith",
      senderType: "partner",
      timestamp: "2024-01-14 10:15",
      priority: "normal",
      status: "read",
      replies: [
        {
          id: 1,
          message: "Thank you for the update. We'll continue monitoring this issue.",
          sender: "You",
          timestamp: "2024-01-14 11:00",
        }
      ],
    },
    {
      id: 3,
      subject: "Monthly Security Report Available",
      message: "Your monthly security report is now available for download in the reports section.",
      sender: "ARES System",
      senderType: "system",
      timestamp: "2024-01-13 09:00",
      priority: "normal",
      status: "read",
      replies: [],
    },
  ];

  const createMessageMutation = useMutation({
    mutationFn: async (messageData: typeof messageForm) => {
      // In real app, this would call the API
      console.log("Creating message:", messageData);
      return { id: Date.now(), ...messageData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setNewMessageDialog(false);
      setMessageForm({ subject: "", message: "", priority: "normal" });
      toast({ title: "Success", description: "Message sent successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send message", variant: "destructive" });
    },
  });

  const getPriorityBadge = (priority: string) => {
    const variants = {
      urgent: "destructive",
      high: "destructive",
      normal: "default",
      low: "secondary",
    } as const;
    return variants[priority as keyof typeof variants] || "default";
  };

  const getSenderIcon = (senderType: string) => {
    switch (senderType) {
      case "admin":
        return <Shield className="h-4 w-4 text-red-600" />;
      case "partner":
        return <User className="h-4 w-4 text-blue-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const unreadCount = messages.filter(m => m.status === "unread").length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          <p className="text-gray-600">Communicate with your security team and partners</p>
        </div>
        <Dialog open={newMessageDialog} onOpenChange={setNewMessageDialog}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Send className="h-4 w-4 mr-2" />
              New Message
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send New Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                  placeholder="Message subject"
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                  placeholder="Type your message here..."
                  rows={6}
                />
              </div>
              <Button
                onClick={() => createMessageMutation.mutate(messageForm)}
                disabled={!messageForm.subject || !messageForm.message || createMessageMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {createMessageMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2h</div>
            <p className="text-xs text-muted-foreground">Average response</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id} className={`${message.status === "unread" ? "border-l-4 border-l-purple-600" : ""}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getSenderIcon(message.senderType)}
                  <div>
                    <h3 className="font-semibold">{message.subject}</h3>
                    <p className="text-sm text-gray-600">From: {message.sender}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getPriorityBadge(message.priority)}>
                    {message.priority}
                  </Badge>
                  {message.status === "unread" && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      New
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{message.message}</p>
              
              {message.replies.length > 0 && (
                <div className="space-y-2 border-t pt-4">
                  <h4 className="font-medium text-sm text-gray-600">Replies:</h4>
                  {message.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-sm">{reply.sender}</span>
                        <span className="text-xs text-gray-500">{reply.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700">{reply.message}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" size="sm">
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}