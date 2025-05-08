import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, MapPin, Bell, Edit, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';

import { Announcement, CreateAnnouncementRequest } from '@/types';
import { format, parseISO } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from '@/components/ui/checkbox';
import { useAnnouncements, useCreateAnnouncement, useDeleteAnnouncement, useSubscribeToAnnouncements, useUpdateAnnouncement } from '@/hooks/use-announcements';
import { AnnouncementDialog } from '@/components/AnnouncementDialog';

const AnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [subscriptionEmail, setSubscriptionEmail] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [isSubmittingSubscription, setIsSubmittingSubscription] = useState(false);

  const { data: announcements = [] as Announcement[], isLoading } = useAnnouncements();
  const createAnnouncementMutation = useCreateAnnouncement();
  const updateAnnouncementMutation = useUpdateAnnouncement();
  const deleteAnnouncementMutation = useDeleteAnnouncement();
  const subscribeToAnnouncementsMutation = useSubscribeToAnnouncements();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'medical', label: 'Medical' },
    { value: 'education', label: 'Education' },
    { value: 'employment', label: 'Employment' },
    { value: 'housing', label: 'Housing' },
    { value: 'legal', label: 'Legal' },
    { value: 'aid', label: 'Aid Distribution' },
    { value: 'other', label: 'Other' },
  ];
  
  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'Berlin', label: 'Berlin' },
    { value: 'Munich', label: 'Munich' },
    { value: 'Hamburg', label: 'Hamburg' },
    { value: 'Frankfurt', label: 'Frankfurt' },
  ];
  
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || announcement.category === selectedCategory;
    const matchesRegion = selectedRegion === 'all' || announcement.region === selectedRegion;
    
    return matchesSearch && matchesCategory && matchesRegion;
  });
  
  const upcomingEvents = (announcements || [])
    .filter(a => a.eventDate)
    .sort((a, b) => new Date(a.eventDate!).getTime() - new Date(b.eventDate!).getTime())
    .filter(a => new Date(a.eventDate!) > new Date())
    .slice(0, 3);
  
  const getCategoryBadgeColor = (category: string) => {
    switch(category) {
      case 'medical':
        return 'bg-red-100 text-red-800';
      case 'education':
        return 'bg-yellow-100 text-yellow-800';
      case 'employment':
        return 'bg-green-100 text-green-800';
      case 'housing':
        return 'bg-blue-100 text-blue-800';
      case 'legal':
        return 'bg-purple-100 text-purple-800';
      case 'aid':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const isAdmin = user?.role === 'admin' || user?.role === 'ngo';

  const handleOpenCreateDialog = () => {
    setCurrentAnnouncement(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    setIsDeleteDialogOpen(true);
  };

  const handleCreateOrUpdateAnnouncement = async (data: CreateAnnouncementRequest) => {
    try {
      if (currentAnnouncement) {
        // Update existing announcement
        await updateAnnouncementMutation.mutateAsync({
          id: currentAnnouncement.id,
          announcement: data
        });
        toast({
          title: "Announcement updated",
          description: "Your announcement has been successfully updated.",
        });
      } else {
        // Create new announcement
        await createAnnouncementMutation.mutateAsync(data);
        toast({
          title: "Announcement created",
          description: "Your announcement has been successfully published.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save announcement",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (!currentAnnouncement) return;
    
    try {
      await deleteAnnouncementMutation.mutateAsync(currentAnnouncement.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Announcement deleted",
        description: "The announcement has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete announcement",
        variant: "destructive",
      });
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriptionEmail) return;
    
    setIsSubmittingSubscription(true);
    try {
      await subscribeToAnnouncementsMutation.mutateAsync({
        email: subscriptionEmail,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        regions: selectedRegions.length > 0 ? selectedRegions : undefined,
      });
      
      toast({
        title: "Subscription successful",
        description: "You'll now receive notifications for new announcements.",
      });
      
      setSubscriptionEmail('');
      setSelectedCategories([]);
      setSelectedRegions([]);
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "Failed to subscribe",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingSubscription(false);
    }
  };

  const handleCategoryCheckboxChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleRegionCheckboxChange = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Announcements</h1>
          {isAdmin && (
            <Button onClick={handleOpenCreateDialog}>
              <Bell className="mr-2 h-4 w-4" /> Create Announcement
            </Button>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="all">
              <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <TabsList>
                  <TabsTrigger value="all">All Announcements</TabsTrigger>
                  <TabsTrigger value="important">Important</TabsTrigger>
                  <TabsTrigger value="events">Upcoming Events</TabsTrigger>
                </TabsList>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search announcements..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <TabsContent value="all" className="space-y-4 mt-0">
                {isLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary mb-4" />
                    <div className="text-xl font-medium mb-2">Loading announcements</div>
                  </div>
                ) : filteredAnnouncements.length > 0 ? (
                  filteredAnnouncements.map((announcement) => (
                    <Card key={announcement.id} className={announcement.important ? 'border-l-4 border-l-red-500' : ''}>
                      <CardHeader className="pb-2">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div>
                            <CardTitle>{announcement.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              {announcement.eventDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(parseISO(announcement.eventDate), 'MMM d, yyyy')}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {announcement.region}
                              </span>
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            {announcement.important && (
                              <Badge variant="destructive">Important</Badge>
                            )}
                            <Badge className={getCategoryBadgeColor(announcement.category)}>
                              {announcement.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{announcement.content}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4 flex-wrap gap-2">
                        <div className="text-sm text-muted-foreground">
                          Posted by: {announcement.postedBy.username} • {format(parseISO(announcement.createdAt), 'MMM d, yyyy')}
                        </div>
                        <div className="flex gap-2">
                          {isAdmin && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleOpenEditDialog(announcement)}>
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleOpenDeleteDialog(announcement)}>
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm">Learn More</Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-xl font-medium mb-2">No announcements found</div>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filters to find announcements.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="important" className="space-y-4 mt-0">
                {isLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary mb-4" />
                    <div className="text-xl font-medium mb-2">Loading important announcements</div>
                  </div>
                ) : filteredAnnouncements.filter(a => a.important).length > 0 ? (
                  filteredAnnouncements.filter(a => a.important).map((announcement) => (
                    <Card key={announcement.id} className="border-l-4 border-l-red-500">
                      <CardHeader className="pb-2">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div>
                            <CardTitle>{announcement.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              {announcement.eventDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(parseISO(announcement.eventDate), 'MMM d, yyyy')}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {announcement.region}
                              </span>
                            </CardDescription>
                          </div>
                          <Badge variant="destructive">Important</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{announcement.content}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4 flex-wrap gap-2">
                        <div className="text-sm text-muted-foreground">
                          Posted by: {announcement.postedBy.username} • {format(parseISO(announcement.createdAt), 'MMM d, yyyy')}
                        </div>
                        <div className="flex gap-2">
                          {isAdmin && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleOpenEditDialog(announcement)}>
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleOpenDeleteDialog(announcement)}>
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            </>
                          )}
                          <Button variant="outline" size="sm">Learn More</Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <AlertTriangle className="h-10 w-10 mx-auto text-amber-500 mb-4" />
                    <div className="text-xl font-medium mb-2">No important announcements found</div>
                    <p className="text-muted-foreground">
                      There are currently no important announcements matching your filters.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="events" className="space-y-4 mt-0">
                {isLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary mb-4" />
                    <div className="text-xl font-medium mb-2">Loading events</div>
                  </div>
                ) : filteredAnnouncements.filter(a => a.eventDate && new Date(a.eventDate) > new Date()).length > 0 ? (
                  filteredAnnouncements
                    .filter(a => a.eventDate && new Date(a.eventDate) > new Date())
                    .map((announcement) => (
                      <Card key={announcement.id} className={announcement.important ? 'border-l-4 border-l-red-500' : ''}>
                        <CardHeader className="pb-2">
                          <div className="flex flex-wrap justify-between items-start gap-2">
                            <div>
                              <CardTitle>{announcement.title}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(parseISO(announcement.eventDate!), 'MMM d, yyyy')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {announcement.region}
                                </span>
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              {announcement.important && (
                                <Badge variant="destructive">Important</Badge>
                              )}
                              <Badge className={getCategoryBadgeColor(announcement.category)}>
                                {announcement.category}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{announcement.content}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t pt-4 flex-wrap gap-2">
                          <div className="text-sm text-muted-foreground">
                            Posted by: {announcement.postedBy.username} • {format(parseISO(announcement.createdAt), 'MMM d, yyyy')}
                          </div>
                          <div className="flex gap-2">
                            {isAdmin && (
                              <>
                                <Button variant="outline" size="sm" onClick={() => handleOpenEditDialog(announcement)}>
                                  <Edit className="h-4 w-4 mr-1" /> Edit
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleOpenDeleteDialog(announcement)}>
                                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                                </Button>
                              </>
                            )}
                            <Button variant="outline" size="sm">Learn More</Button>
                          </div>
                        </CardFooter>
                      </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    <div className="text-xl font-medium mb-2">No upcoming events found</div>
                    <p className="text-muted-foreground">
                      There are currently no upcoming events matching your filters.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex-shrink-0 flex flex-col items-center justify-center bg-muted rounded-lg p-3 w-14 h-14">
                          <span className="text-sm font-bold">
                            {format(parseISO(event.eventDate!), 'd')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(parseISO(event.eventDate!), 'MMM')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{event.title}</h3>
                          <p className="text-xs text-muted-foreground">{event.region}</p>
                          <Badge className={`mt-1 ${getCategoryBadgeColor(event.category)}`} variant="secondary">
                            {event.category}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No upcoming events scheduled.</p>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View All Events</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Subscribe to Updates</CardTitle>
                  <CardDescription>Get notified about new announcements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleSubscribe}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Email</label>
                        <Input 
                          type="email" 
                          placeholder="email@example.com"
                          value={subscriptionEmail}
                          onChange={(e) => setSubscriptionEmail(e.target.value)}
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Categories of Interest</label>
                        <div className="grid grid-cols-2 gap-2">
                          {categories
                            .filter(cat => cat.value !== 'all')
                            .map((category) => (
                              <div key={category.value} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`cat-${category.value}`}
                                  checked={selectedCategories.includes(category.value)}
                                  onCheckedChange={() => handleCategoryCheckboxChange(category.value)}
                                />
                                <label 
                                  htmlFor={`cat-${category.value}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {category.label}
                                </label>
                              </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Regions of Interest</label>
                        <div className="grid grid-cols-2 gap-2">
                          {regions
                            .filter(reg => reg.value !== 'all')
                            .map((region) => (
                              <div key={region.value} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`reg-${region.value}`}
                                  checked={selectedRegions.includes(region.value)}
                                  onCheckedChange={() => handleRegionCheckboxChange(region.value)}
                                />
                                <label 
                                  htmlFor={`reg-${region.value}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {region.label}
                                </label>
                              </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={!subscriptionEmail || isSubmittingSubscription}
                      >
                        {isSubmittingSubscription ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subscribing...
                          </>
                        ) : (
                          'Subscribe'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Create/Edit Announcement Dialog */}
      <AnnouncementDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateOrUpdateAnnouncement}
        announcement={currentAnnouncement ? {
          id: currentAnnouncement.id,
          title: currentAnnouncement.title,
          content: currentAnnouncement.content,
          category: currentAnnouncement.category,
          region: currentAnnouncement.region,
          important: currentAnnouncement.important,
          eventDate: currentAnnouncement.eventDate ? parseISO(currentAnnouncement.eventDate) : undefined
        } : undefined}
        isEditing={!!currentAnnouncement}
      />
      
      {/* Confirmation Dialog for Delete */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this announcement. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAnnouncement}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteAnnouncementMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default AnnouncementsPage;