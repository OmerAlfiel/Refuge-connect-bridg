
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Check, Heart, Home, FileText, MessageCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Notifications: React.FC = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'match',
      title: 'New Match Found',
      description: 'Sarah Miller has offered a temporary room matching your need.',
      time: '10 mins ago',
      read: false,
      actionTaken: false,
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message',
      description: 'You received a message from Legal Aid Society about your appointment.',
      time: '1 hour ago',
      read: true,
      actionTaken: false,
    },
    {
      id: '3',
      type: 'system',
      title: 'Verification Complete',
      description: 'Your account has been verified. You can now access all features.',
      time: 'Yesterday',
      read: true,
      actionTaken: true,
    },
    {
      id: '4',
      type: 'offer',
      title: 'Offer Accepted',
      description: 'Ahmed Hassan has accepted your translation help offer.',
      time: '2 days ago',
      read: true,
      actionTaken: true,
    },
    {
      id: '5',
      type: 'announcement',
      title: 'New Announcement',
      description: 'Free Medical Camp available at Central Community Center on May 15, 2023.',
      time: '3 days ago',
      read: false,
      actionTaken: false,
    },
  ]);
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    toast({
      title: "Notification marked as read",
    });
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast({
      title: "All notifications marked as read",
    });
  };
  
  const handleActionTaken = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, actionTaken: true } : notification
    ));
    toast({
      title: "Action recorded",
      description: "You've taken action on this notification.",
    });
  };
  
  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
    toast({
      title: "Notification deleted",
    });
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Layout>
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground text-sm rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with important alerts and messages
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <Check className="mr-2 h-4 w-4" /> Mark All as Read
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4 space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Card key={notification.id} className={cn(!notification.read && "border-l-4 border-l-primary")}>
                  <CardContent className="p-4 flex justify-between">
                    <div className="flex gap-4">
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full",
                        notification.type === 'match' && "bg-volunteer-100 text-volunteer-700",
                        notification.type === 'message' && "bg-blue-100 text-blue-700",
                        notification.type === 'system' && "bg-muted text-muted-foreground",
                        notification.type === 'offer' && "bg-green-100 text-green-700",
                        notification.type === 'announcement' && "bg-amber-100 text-amber-700",
                      )}>
                        {notification.type === 'match' && <Heart className="h-6 w-6" />}
                        {notification.type === 'message' && <MessageCircle className="h-6 w-6" />}
                        {notification.type === 'system' && <Bell className="h-6 w-6" />}
                        {notification.type === 'offer' && <Home className="h-6 w-6" />}
                        {notification.type === 'announcement' && <FileText className="h-6 w-6" />}
                      </div>
                      <div>
                        <h3 className={cn("font-semibold", notification.read && "font-medium")}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                  
                  {!notification.actionTaken && notification.type !== 'system' && (
                    <CardFooter className="px-4 py-2 bg-muted/30 flex justify-end">
                      <Button 
                        size="sm" 
                        variant={notification.type === 'match' ? "default" : "outline"}
                        onClick={() => handleActionTaken(notification.id)}
                      >
                        {notification.type === 'match' && "View Match"}
                        {notification.type === 'message' && "Reply"}
                        {notification.type === 'offer' && "View Details"}
                        {notification.type === 'announcement' && "Learn More"}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">No notifications</h3>
                  <p className="text-muted-foreground">You're all caught up!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="unread" className="mt-4 space-y-4">
            {notifications.filter(n => !n.read).length > 0 ? (
              notifications
                .filter(n => !n.read)
                .map((notification) => (
                  <Card key={notification.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4 flex justify-between">
                      <div className="flex gap-4">
                        <div className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-full",
                          notification.type === 'match' && "bg-volunteer-100 text-volunteer-700",
                          notification.type === 'message' && "bg-blue-100 text-blue-700",
                          notification.type === 'system' && "bg-muted text-muted-foreground",
                          notification.type === 'offer' && "bg-green-100 text-green-700",
                          notification.type === 'announcement' && "bg-amber-100 text-amber-700",
                        )}>
                          {notification.type === 'match' && <Heart className="h-6 w-6" />}
                          {notification.type === 'message' && <MessageCircle className="h-6 w-6" />}
                          {notification.type === 'system' && <Bell className="h-6 w-6" />}
                          {notification.type === 'offer' && <Home className="h-6 w-6" />}
                          {notification.type === 'announcement' && <FileText className="h-6 w-6" />}
                        </div>
                        <div>
                          <h3 className="font-semibold">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                    
                    {!notification.actionTaken && notification.type !== 'system' && (
                      <CardFooter className="px-4 py-2 bg-muted/30 flex justify-end">
                        <Button 
                          size="sm" 
                          variant={notification.type === 'match' ? "default" : "outline"}
                          onClick={() => handleActionTaken(notification.id)}
                        >
                          {notification.type === 'match' && "View Match"}
                          {notification.type === 'message' && "Reply"}
                          {notification.type === 'offer' && "View Details"}
                          {notification.type === 'announcement' && "Learn More"}
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Check className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">No unread notifications</h3>
                  <p className="text-muted-foreground">You're all caught up!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">Receive important notifications via email</p>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-muted-foreground">Enable browser push notifications</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notification Filters</h3>
                <p className="text-sm text-muted-foreground">Customize which notifications you receive</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Notifications;
