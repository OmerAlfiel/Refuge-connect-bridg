import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Check, Heart, Home, FileText, MessageCircle, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { 
  useNotifications, 
  useMarkNotificationAsRead, 
  useMarkAllNotificationsAsRead,
  useMarkNotificationActionTaken,
  useDeleteNotification
} from '@/hooks/use-notification';
import { Notification, NotificationType } from '@/types';


const Notifications: React.FC = () => {
  const { toast } = useToast();
  
  // Get notifications
  const { data: allNotifications = [], isLoading } = useNotifications() as {
    data: Notification[];
    isLoading: boolean;
  }
  const { data: unreadNotifications = [], isLoading: isLoadingUnread } = useNotifications({ read: false }) as {
    data: Notification[];
    isLoading: boolean;
  }
  
  // Mutations
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const markActionTakenMutation = useMarkNotificationActionTaken();
  const deleteNotificationMutation = useDeleteNotification();

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsReadMutation.mutateAsync(id);
      toast({
        title: "Notification marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsReadMutation.mutateAsync();
      toast({
        title: "All notifications marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to mark notifications as read",
        variant: "destructive",
      });
    }
  };
  
  const handleActionTaken = async (id: string, type: NotificationType, entityId?: string) => {
    try {
      await markActionTakenMutation.mutateAsync(id);
      
      // Navigate based on notification type
      // Will be handled by the Link component, we just mark it as actioned
      
      toast({
        title: "Action recorded",
        description: "You've taken action on this notification.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to record action",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteNotification = async (id: string) => {
    try {
      await deleteNotificationMutation.mutateAsync(id);
      toast({
        title: "Notification deleted",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete notification",
        variant: "destructive",
      });
    }
  };
  
  const formatNotificationTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) {
        return 'just now';
      }
      
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `${diffInMinutes} min${diffInMinutes === 1 ? '' : 's'} ago`;
      }
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
      }
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
      }
      
      return format(date, 'MMM d, yyyy');
    } catch {
      return 'unknown time';
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch(type) {
      case NotificationType.MATCH:
        return <Heart className="h-6 w-6" />;
      case NotificationType.MESSAGE:
        return <MessageCircle className="h-6 w-6" />;
      case NotificationType.SYSTEM:
        return <Bell className="h-6 w-6" />;
      case NotificationType.OFFER:
        return <Home className="h-6 w-6" />;
      case NotificationType.ANNOUNCEMENT:
        return <FileText className="h-6 w-6" />;
      default:
        return <Bell className="h-6 w-6" />;
    }
  };
  
  const getNotificationIconBackground = (type: NotificationType) => {
    switch(type) {
      case NotificationType.MATCH:
        return "bg-volunteer-100 text-volunteer-700";
      case NotificationType.MESSAGE:
        return "bg-blue-100 text-blue-700";
      case NotificationType.SYSTEM:
        return "bg-muted text-muted-foreground";
      case NotificationType.OFFER:
        return "bg-green-100 text-green-700";
      case NotificationType.ANNOUNCEMENT:
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  
  const getActionButtonText = (type: NotificationType) => {
    switch(type) {
      case NotificationType.MATCH:
        return "View Match";
      case NotificationType.MESSAGE:
        return "Reply";
      case NotificationType.OFFER:
        return "View Details";
      case NotificationType.ANNOUNCEMENT:
        return "Learn More";
      default:
        return "View";
    }
  };
  
  const getActionDestination = (type: NotificationType, entityId?: string) => {
    switch(type) {
      case NotificationType.MATCH:
        return `/matches?id=${entityId || ''}`;
      case NotificationType.MESSAGE:
        return `/messages?conversation=${entityId || ''}`;
      case NotificationType.OFFER:
        return `/offers?id=${entityId || ''}`;
      case NotificationType.ANNOUNCEMENT:
        return `/announcements`;
      default:
        return '/';
    }
  };

  const unreadCount = unreadNotifications.length;

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
            <Button 
              variant="outline" 
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending || unreadCount === 0}
            >
              {markAllAsReadMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              Mark All as Read
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4 space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">Loading notifications</h3>
                </CardContent>
              </Card>
            ) : allNotifications.length > 0 ? (
              allNotifications.map((notification) => (
                <Card key={notification.id} className={cn(!notification.read && "border-l-4 border-l-primary")}>
                  <CardContent className="p-4 flex justify-between">
                    <div className="flex gap-4">
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full",
                        getNotificationIconBackground(notification.type)
                      )}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div>
                        <h3 className={cn("font-semibold", notification.read && "font-medium")}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatNotificationTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={markAsReadMutation.isPending}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteNotification(notification.id)}
                        disabled={deleteNotificationMutation.isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                  
                  {!notification.actionTaken && notification.type !== NotificationType.SYSTEM && (
                    <CardFooter className="px-4 py-2 bg-muted/30 flex justify-end">
                      <Button 
                        size="sm" 
                        variant={notification.type === NotificationType.MATCH ? "default" : "outline"}
                        onClick={() => handleActionTaken(
                          notification.id, 
                          notification.type,
                          notification.entityId
                        )}
                        asChild
                      >
                        <Link to={getActionDestination(notification.type, notification.entityId)}>
                          {getActionButtonText(notification.type)}
                        </Link>
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
            {isLoadingUnread ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">Loading notifications</h3>
                </CardContent>
              </Card>
            ) : unreadNotifications.length > 0 ? (
              unreadNotifications.map((notification) => (
                <Card key={notification.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4 flex justify-between">
                    <div className="flex gap-4">
                      <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full",
                        getNotificationIconBackground(notification.type)
                      )}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatNotificationTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={markAsReadMutation.isPending}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteNotification(notification.id)}
                        disabled={deleteNotificationMutation.isPending}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                  
                  {!notification.actionTaken && notification.type !== NotificationType.SYSTEM && (
                    <CardFooter className="px-4 py-2 bg-muted/30 flex justify-end">
                      <Button 
                        size="sm" 
                        variant={notification.type === NotificationType.MATCH ? "default" : "outline"}
                        onClick={() => handleActionTaken(
                          notification.id, 
                          notification.type,
                          notification.entityId
                        )}
                        asChild
                      >
                        <Link to={getActionDestination(notification.type, notification.entityId)}>
                          {getActionButtonText(notification.type)}
                        </Link>
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
              <Button variant="outline" size="sm" asChild>
                <Link to="/settings#notifications-section">Manage</Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-muted-foreground">Enable browser push notifications</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/settings#notifications-section">Enable</Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notification Filters</h3>
                <p className="text-sm text-muted-foreground">Customize which notifications you receive</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/settings#notifications-section">Configure</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Notifications;