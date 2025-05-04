
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, MapPin, Bell, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';

const Announcements: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  
  // Sample announcement data
  const announcements = [
    {
      id: '1',
      title: 'Free Medical Camp',
      content: 'Medical services available at Central Community Center on May 15, 2023. Bring your ID documents. Services include general health check-ups, vaccinations, dental check-ups, and eye examinations.',
      category: 'medical',
      region: 'Berlin',
      postedBy: 'Medical Aid International',
      date: new Date(2023, 4, 10),
      eventDate: new Date(2023, 4, 15),
      important: true,
    },
    {
      id: '2',
      title: 'Language Classes Registration',
      content: 'Free language classes registration starting next week. German, English and French available. Classes will be held at the Public Library and are available for all levels from beginners to advanced.',
      category: 'education',
      region: 'Berlin',
      postedBy: 'Education Support Network',
      date: new Date(2023, 4, 8),
      eventDate: new Date(2023, 4, 20),
      important: false,
    },
    {
      id: '3',
      title: 'Job Fair for Refugees',
      content: 'Local businesses are participating in a job fair specifically for refugees. Bring your CV and any work certificates. Translation services will be available. Various sectors including hospitality, construction, IT, and healthcare.',
      category: 'employment',
      region: 'Munich',
      postedBy: 'Refugee Employment Initiative',
      date: new Date(2023, 4, 5),
      eventDate: new Date(2023, 4, 25),
      important: true,
    },
    {
      id: '4',
      title: 'Housing Assistance Workshop',
      content: 'Workshop on navigating housing options, tenant rights, and assistance programs. Legal advisors will be present to answer questions about housing contracts and regulations.',
      category: 'housing',
      region: 'Hamburg',
      postedBy: 'Shelter Network',
      date: new Date(2023, 4, 3),
      eventDate: new Date(2023, 4, 18),
      important: false,
    },
    {
      id: '5',
      title: 'Winter Clothing Distribution',
      content: 'Winter clothing items will be distributed at the Community Hall. Items include jackets, boots, gloves, and scarves for adults and children. First come, first served basis.',
      category: 'aid',
      region: 'Berlin',
      postedBy: 'Humanitarian Aid Society',
      date: new Date(2023, 4, 1),
      eventDate: new Date(2023, 4, 12),
      important: false,
    },
    {
      id: '6',
      title: 'Legal Aid Consultation Day',
      content: 'Free legal consultations for asylum applications and immigration issues. Appointments required. Translation services available in Arabic, Farsi, and French.',
      category: 'legal',
      region: 'Frankfurt',
      postedBy: 'Legal Aid Society',
      date: new Date(2023, 3, 28),
      eventDate: new Date(2023, 4, 22),
      important: true,
    },
  ];
  
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
  
  const upcomingEvents = [...announcements].sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime()).filter(a => a.eventDate > new Date()).slice(0, 3);
  
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
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Announcements</h1>
          {isAdmin && (
            <Button>
              <Bell className="mr-2 h-4 w-4" /> Create Announcement
            </Button>
          )}
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="all">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Announcements</TabsTrigger>
                  <TabsTrigger value="important">Important</TabsTrigger>
                  <TabsTrigger value="events">Upcoming Events</TabsTrigger>
                </TabsList>
                
                {isAdmin && (
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Manage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="edit">Edit Announcements</SelectItem>
                      <SelectItem value="delete">Delete Announcements</SelectItem>
                      <SelectItem value="archive">Archive Announcements</SelectItem>
                    </SelectContent>
                  </Select>
                )}
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
                {filteredAnnouncements.length > 0 ? (
                  filteredAnnouncements.map((announcement) => (
                    <Card key={announcement.id} className={announcement.important ? 'border-l-4 border-l-red-500' : ''}>
                      <CardHeader className="pb-2">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div>
                            <CardTitle>{announcement.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {announcement.eventDate.toLocaleDateString()}
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
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="text-sm text-muted-foreground">
                          Posted by: {announcement.postedBy} • {announcement.date.toLocaleDateString()}
                        </div>
                        <Button variant="outline" size="sm">Learn More</Button>
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
                {filteredAnnouncements.filter(a => a.important).length > 0 ? (
                  filteredAnnouncements.filter(a => a.important).map((announcement) => (
                    <Card key={announcement.id} className="border-l-4 border-l-red-500">
                      <CardHeader className="pb-2">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div>
                            <CardTitle>{announcement.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {announcement.eventDate.toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {announcement.region}
                              </span>
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="destructive">Important</Badge>
                            <Badge className={getCategoryBadgeColor(announcement.category)}>
                              {announcement.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{announcement.content}</p>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="text-sm text-muted-foreground">
                          Posted by: {announcement.postedBy} • {announcement.date.toLocaleDateString()}
                        </div>
                        <Button variant="outline" size="sm">Learn More</Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-xl font-medium mb-2">No important announcements found</div>
                    <p className="text-muted-foreground">
                      There are currently no important announcements matching your filters.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="events" className="space-y-4 mt-0">
                {filteredAnnouncements.filter(a => a.eventDate > new Date()).length > 0 ? (
                  filteredAnnouncements.filter(a => a.eventDate > new Date()).map((announcement) => (
                    <Card key={announcement.id} className={announcement.important ? 'border-l-4 border-l-red-500' : ''}>
                      <CardHeader className="pb-2">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <div>
                            <CardTitle>{announcement.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {announcement.eventDate.toLocaleDateString()}
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
                      <CardFooter className="flex justify-between border-t pt-4">
                        <div className="text-sm text-muted-foreground">
                          Posted by: {announcement.postedBy} • {announcement.date.toLocaleDateString()}
                        </div>
                        <Button variant="outline" size="sm">Learn More</Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
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
                  {upcomingEvents.length > 0 ? (
                    upcomingEvents.map((event) => (
                      <div key={event.id} className="flex gap-4">
                        <div className="flex-shrink-0 flex flex-col items-center justify-center bg-muted rounded-lg p-3 w-14 h-14">
                          <span className="text-sm font-bold">{event.eventDate.getDate()}</span>
                          <span className="text-xs text-muted-foreground">{event.eventDate.toLocaleString('default', { month: 'short' })}</span>
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your Email</label>
                    <Input type="email" placeholder="email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Regions of Interest</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select regions" />
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
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Categories of Interest</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Select categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Subscribe</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Announcements;
