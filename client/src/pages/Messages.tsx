
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Search, Plus, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Messages: React.FC = () => {
  const [activeConversation, setActiveConversation] = useState<string | null>('1');
  const [messageText, setMessageText] = useState('');
  const { toast } = useToast();

  const conversations = [
    {
      id: '1',
      with: 'Sarah Miller',
      role: 'volunteer',
      lastMessage: 'Is the room still available for next week?',
      time: '10:24 AM',
      unread: true,
      avatar: '/avatars/volunteer.png',
      messages: [
        { 
          id: '1a', 
          sender: 'them', 
          text: 'Hello, I saw your offer for temporary housing. Is it still available?', 
          time: '10:15 AM'
        },
        { 
          id: '1b', 
          sender: 'me', 
          text: 'Yes, it is! When would you need it?', 
          time: '10:18 AM'
        },
        { 
          id: '1c', 
          sender: 'them', 
          text: 'Is the room still available for next week?', 
          time: '10:24 AM'
        },
      ]
    },
    {
      id: '2',
      with: 'Legal Aid Society',
      role: 'ngo',
      lastMessage: 'Your appointment is confirmed for Thursday at 2 PM.',
      time: 'Yesterday',
      unread: false,
      avatar: '/avatars/ngo.png',
      messages: [
        { 
          id: '2a', 
          sender: 'them', 
          text: 'Hello, we received your request for legal assistance.', 
          time: 'Yesterday, 3:45 PM'
        },
        { 
          id: '2b', 
          sender: 'them', 
          text: 'Would you be available for an appointment this week?', 
          time: 'Yesterday, 3:46 PM'
        },
        { 
          id: '2c', 
          sender: 'me', 
          text: 'Yes, Thursday afternoon works for me.', 
          time: 'Yesterday, 4:30 PM'
        },
        { 
          id: '2d', 
          sender: 'them', 
          text: 'Your appointment is confirmed for Thursday at 2 PM.', 
          time: 'Yesterday, 4:45 PM'
        },
      ]
    },
    {
      id: '3',
      with: 'Ahmed Hassan',
      role: 'refugee',
      lastMessage: 'Thank you for your help with the documents!',
      time: 'Monday',
      unread: false,
      avatar: '/avatars/refugee.png',
      messages: [
        { 
          id: '3a', 
          sender: 'them', 
          text: 'Hello, I need help with translating some documents.', 
          time: 'Monday, 9:15 AM'
        },
        { 
          id: '3b', 
          sender: 'me', 
          text: 'I would be happy to help. What languages do you need?', 
          time: 'Monday, 10:20 AM'
        },
        { 
          id: '3c', 
          sender: 'them', 
          text: 'Arabic to English, for some medical documents.', 
          time: 'Monday, 11:05 AM'
        },
        { 
          id: '3d', 
          sender: 'me', 
          text: 'I can do that. Please send the documents and I will translate them by tomorrow.', 
          time: 'Monday, 11:30 AM'
        },
        { 
          id: '3e', 
          sender: 'them', 
          text: 'Thank you for your help with the documents!', 
          time: 'Monday, 4:45 PM'
        },
      ]
    },
  ];
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    toast({
      title: "Message sent",
      description: "Your message has been delivered.",
    });
    
    setMessageText('');
  };
  
  const currentConversation = conversations.find(c => c.id === activeConversation);

  return (
    <Layout>
      <div className="container px-4 md:px-6 py-8">
        <div className="grid md:grid-cols-12 gap-6 h-[calc(80vh-120px)]">
          {/* Conversations Sidebar */}
          <div className="md:col-span-4 lg:col-span-3 border rounded-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-xl">Messages</h2>
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search conversations..."
                  className="pl-8"
                />
              </div>
            </div>
            
            <Tabs defaultValue="all" className="flex-1 flex flex-col">
              <TabsList className="bg-transparent border-b px-4 pt-2 justify-start">
                <TabsTrigger value="all" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">All</TabsTrigger>
                <TabsTrigger value="unread" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Unread</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="flex-1 overflow-y-auto data-[state=active]:flex-1">
                {conversations.map(conversation => (
                  <div 
                    key={conversation.id}
                    className={cn(
                      "p-4 border-b cursor-pointer hover:bg-muted/50 flex items-center gap-3",
                      activeConversation === conversation.id ? "bg-muted/60" : "",
                      conversation.unread ? "bg-muted/20" : ""
                    )}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                        <img src={conversation.avatar} alt={conversation.with} className="h-full w-full object-cover" />
                      </div>
                      {conversation.unread && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className={cn("font-medium truncate", conversation.unread && "font-semibold")}>{conversation.with}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{conversation.time}</span>
                      </div>
                      <p className={cn(
                        "text-sm truncate text-muted-foreground",
                        conversation.unread && "text-foreground font-medium"
                      )}>
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="unread" className="flex-1 overflow-y-auto data-[state=active]:flex-1">
                {conversations.filter(c => c.unread).map(conversation => (
                  <div 
                    key={conversation.id}
                    className={cn(
                      "p-4 border-b cursor-pointer hover:bg-muted/50 flex items-center gap-3",
                      activeConversation === conversation.id ? "bg-muted/60" : "",
                    )}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                        <img src={conversation.avatar} alt={conversation.with} className="h-full w-full object-cover" />
                      </div>
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold truncate">{conversation.with}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{conversation.time}</span>
                      </div>
                      <p className="text-sm truncate font-medium">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                ))}
                
                {conversations.filter(c => c.unread).length === 0 && (
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
            {activeConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b flex items-center justify-between bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                      <img src={currentConversation?.avatar} alt={currentConversation?.with} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <h2 className="font-semibold">{currentConversation?.with}</h2>
                      <p className="text-xs text-muted-foreground capitalize">{currentConversation?.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentConversation?.messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={cn(
                        "flex",
                        message.sender === 'me' ? "justify-end" : "justify-start"
                      )}
                    >
                      <div 
                        className={cn(
                          "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                          message.sender === 'me' 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-muted"
                        )}
                      >
                        <p>{message.text}</p>
                        <p className={cn(
                          "text-xs mt-1",
                          message.sender === 'me' 
                            ? "text-primary-foreground/80" 
                            : "text-muted-foreground"
                        )}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}
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
                    <Button type="submit" disabled={!messageText.trim()}>
                      Send
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">No conversation selected</h3>
                <p className="text-sm text-muted-foreground mb-4">Select a conversation to start messaging</p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Message
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
