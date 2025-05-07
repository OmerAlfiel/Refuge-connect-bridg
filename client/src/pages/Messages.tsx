import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Search, Plus, Check, X, User, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';



import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';
import { useConversationMessages, useConversations, useCreateConversation, useSendMessage } from '@/hooks/use-message';
import { Conversation } from '@/types';
import { useUsers } from '@/hooks/use-users';


const Messages: React.FC = () => {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewMessageDialogOpen, setIsNewMessageDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Data fetching
  const { data: conversations = [], isLoading: isLoadingConversations } = useConversations();
  const { data: messages = [], isLoading: isLoadingMessages } = useConversationMessages(activeConversationId || undefined);
  const { data: users = [], isLoading: isLoadingUsers, error: usersError } = useUsers();
  const sendMessageMutation = useSendMessage();
  const createConversationMutation = useCreateConversation();
  
  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Find selected conversation
  const currentConversation = (conversations as Conversation[]).find(c => c.id === activeConversationId);
  
  // Filter conversations by search query
  const filteredConversations = (conversations as Conversation[]).filter(conversation => {
    if (!searchQuery) return true;
    
    // Try to find matching participant name
    return conversation.participants.some(participant => 
      participant.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Get other participant for display
  const getOtherParticipants = (conversation: Conversation) => {
    return conversation.participants.filter(p => p.id !== user?.id);
  };
  
  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversationId) return;
    
    try {
      await sendMessageMutation.mutateAsync({
        conversationId: activeConversationId,
        content: messageText.trim(),
      });
      
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Message failed",
        description: "Your message could not be sent. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle creating a new conversation
  const handleCreateConversation = async () => {
    if (!selectedUserId || !initialMessage.trim()) return;
    
    try {
      const conversation = await createConversationMutation.mutateAsync({
        participantIds: [selectedUserId],
        initialMessage: initialMessage.trim(),
      });
      
      setIsNewMessageDialogOpen(false);
      setSelectedUserId('');
      setInitialMessage('');
      setActiveConversationId(conversation.id);
      
      toast({
        title: "Message sent",
        description: "Your new conversation has been started.",
      });
    } catch (error) {
      console.error('Failed to create conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Format timestamp for display
  const formatMessageTime = (timestamp: string | Date | null | undefined) => {
    if (!timestamp) {
      console.log('Missing timestamp:', timestamp);
      return 'Unknown time';
    }
    
    try {
      console.log('Attempting to format timestamp:', timestamp);
      const date = new Date(timestamp);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.log('Invalid date format:', timestamp);
        return 'Unknown time';
      }
      
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === now.toDateString()) {
        return format(date, 'h:mm a'); // Today: 2:30 PM
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday ' + format(date, 'h:mm a'); // Yesterday 2:30 PM
      } else {
        return format(date, 'MMM d, h:mm a'); // Mar 15, 2:30 PM
      }
    } catch (error) {
      console.error('Error formatting timestamp:', error, timestamp);
      return 'Unknown time';
    }
  };

  return (
    <Layout>
      <div className="container px-4 md:px-6 py-8">
        <div className="grid md:grid-cols-12 gap-6 h-[calc(80vh-120px)]">
          {/* Conversations Sidebar */}
          <div className="md:col-span-4 lg:col-span-3 border rounded-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-xl">Messages</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsNewMessageDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search conversations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs defaultValue="all" className="flex-1 flex flex-col">
              <TabsList className="bg-transparent border-b px-4 pt-2 justify-start">
                <TabsTrigger value="all" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">All</TabsTrigger>
                <TabsTrigger value="unread" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Unread</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="flex-1 overflow-y-auto data-[state=active]:flex-1">
                {isLoadingConversations ? (
                  // Loading skeleton
                  Array(5).fill(0).map((_, i) => (
                    <div key={i} className="p-4 border-b flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : filteredConversations.length > 0 ? (
                  filteredConversations.map(conversation => {
                    const otherParticipants = getOtherParticipants(conversation);
                    const hasUnread = conversation.messages?.some(
                      m => !m.read && m.senderId !== user?.id
                    );
                    
                    return (
                      <div 
                        key={conversation.id}
                        className={cn(
                          "p-4 border-b cursor-pointer hover:bg-muted/50 flex items-center gap-3",
                          activeConversationId === conversation.id ? "bg-muted/60" : "",
                          hasUnread ? "bg-muted/20" : ""
                        )}
                        onClick={() => setActiveConversationId(conversation.id)}
                      >
                        <div className="relative">
                          {otherParticipants.length === 1 ? (
                            <div className="h-10 w-10 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                              {otherParticipants[0].avatar ? (
                                <img 
                                  src={otherParticipants[0].avatar} 
                                  alt={otherParticipants[0].name} 
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <User className="h-6 w-6 text-muted-foreground" />
                              )}
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                              <UserPlus className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          {hasUnread && (
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>
                          )}
                        </div>
                        
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className={cn(
                                "font-medium truncate", 
                                hasUnread && "font-semibold"
                              )}>
                                {otherParticipants.map(p => p.name).join(', ')}
                              </h3>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {conversation.lastMessageAt ? 
                                  formatMessageTime(conversation.lastMessageAt) : 
                                  'New'}
                              </span>
                            </div>
                            <p className="text-sm truncate">
                              {conversation.lastMessage || 'No messages yet'}
                            </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mb-2" />
                    <h3 className="font-medium text-lg">No conversations yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start messaging with others by clicking the + button
                    </p>
                    <Button onClick={() => setIsNewMessageDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> New Conversation
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="unread" className="flex-1 overflow-y-auto data-[state=active]:flex-1">
                {isLoadingConversations ? (
                  // Loading skeleton
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="p-4 border-b flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : filteredConversations.some(c => 
                  c.messages?.some(m => !m.read && m.senderId !== user?.id)
                ) ? (
                  filteredConversations
                    .filter(c => c.messages?.some(m => !m.read && m.senderId !== user?.id))
                    .map(conversation => {
                      const otherParticipants = getOtherParticipants(conversation);
                      
                      return (
                        <div 
                          key={conversation.id}
                          className={cn(
                            "p-4 border-b cursor-pointer hover:bg-muted/50 flex items-center gap-3",
                            activeConversationId === conversation.id ? "bg-muted/60" : "",
                          )}
                          onClick={() => setActiveConversationId(conversation.id)}
                        >
                          <div className="relative">
                            {otherParticipants.length === 1 ? (
                              <div className="h-10 w-10 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                                {otherParticipants[0].avatar ? (
                                  <img 
                                    src={otherParticipants[0].avatar} 
                                    alt={otherParticipants[0].name} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <User className="h-6 w-6 text-muted-foreground" />
                                )}
                              </div>
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                <UserPlus className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold truncate">
                                {otherParticipants.map(p => p.name).join(', ')}
                              </h3>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {conversation.lastMessageAt && 
                                  formatMessageTime(conversation.lastMessageAt)}
                              </span>
                            </div>
                            <p className="text-sm truncate font-medium">
                              {conversation.lastMessage || 'No messages yet'}
                            </p>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <Check className="h-12 w-12 text-muted-foreground mb-2" />
                    <h3 className="font-medium text-lg">All caught up!</h3>
                    <p className="text-sm text-muted-foreground">No unread messages.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Message Content */}
          <div className="md:col-span-8 lg:col-span-9 border rounded-lg overflow-hidden flex flex-col">
            {activeConversationId && currentConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                  <div className="flex items-center gap-3">
                    {getOtherParticipants(currentConversation).length === 1 ? (
                      <div className="h-10 w-10 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                        {getOtherParticipants(currentConversation)[0].avatar ? (
                          <img 
                            src={getOtherParticipants(currentConversation)[0].avatar} 
                            alt={getOtherParticipants(currentConversation)[0].name}
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <User className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <UserPlus className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h2 className="font-semibold">
                        {getOtherParticipants(currentConversation).map(p => p.name).join(', ')}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {getOtherParticipants(currentConversation).map(p => p.role).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isLoadingMessages ? (
                    // Loading skeleton
                    Array(5).fill(0).map((_, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "flex",
                          i % 2 === 0 ? "justify-start" : "justify-end"
                        )}
                      >
                        <Skeleton 
                          className={cn(
                            "h-16 rounded-lg",
                            i % 2 === 0 ? "w-3/4" : "w-2/4"
                          )} 
                        />
                      </div>
                    ))
                  ) : messages.length > 0 ? (
                    messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={cn(
                          "flex",
                          message.senderId === user?.id ? "justify-end" : "justify-start"
                        )}
                      >
                        <div 
                          className={cn(
                            "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                            message.senderId === user?.id 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-muted"
                          )}
                        >
                          <p>{message.content}</p>
                          <p className={cn(
                            "text-xs mt-1",
                            message.senderId === user?.id 
                              ? "text-primary-foreground/80" 
                              : "text-muted-foreground"
                          )}>
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full text-center">
                      <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
                    </div>
                  )}
                  <div ref={messageEndRef} />
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t bg-muted/30">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input 
                      placeholder="Type a message..." 
                      value={messageText} 
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      disabled={!messageText.trim() || sendMessageMutation.isPending}
                    >
                      {sendMessageMutation.isPending ? "Sending..." : "Send"}
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">No conversation selected</h3>
                <p className="text-sm text-muted-foreground mb-4">Select a conversation to start messaging</p>
                <Button onClick={() => setIsNewMessageDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> New Message
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Message Dialog */}
      
      <Dialog open={isNewMessageDialogOpen} onOpenChange={setIsNewMessageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
            <DialogDescription>
              Start a new conversation with another user
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="recipient" className="text-sm font-medium">Recipient</label>
              <Select
                value={selectedUserId}
                onValueChange={setSelectedUserId}
                disabled={isLoadingUsers}
              >
                <SelectTrigger id="recipient">
                  <SelectValue placeholder={isLoadingUsers ? "Loading users..." : "Select recipient"} />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingUsers ? (
                    <div className="p-2 flex items-center justify-center">
                      <span className="mr-2">Loading users...</span>
                    </div>
                  ) : usersError ? (
                    <div className="p-2 text-red-500">
                      {usersError instanceof Error ? usersError.message : "Failed to load users"}
                    </div>
                  ) : !users || users.length === 0 ? (
                    <div className="p-2">No available users to message</div>
                  ) : (
                    users.map(u => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <Input
                id="message"
                placeholder="Type your message..."
                value={initialMessage}
                onChange={(e) => setInitialMessage(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsNewMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleCreateConversation}
              disabled={!selectedUserId || !initialMessage.trim() || createConversationMutation.isPending}
            >
              {createConversationMutation.isPending ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Messages;