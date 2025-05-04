import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Filter, MapPin, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const Needs: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);

  // Sample data - in a real app, this would come from an API
  const needsData = [
    {
      id: '1',
      title: 'Need temporary shelter',
      description: 'Family of 4 looking for temporary shelter for 2 weeks.',
      category: 'shelter',
      location: 'Berlin, Germany',
      postedBy: 'Ahmed H.',
      date: new Date(2023, 4, 15),
      urgent: true,
      status: 'open',
    },
    {
      id: '2',
      title: 'Help with translation of documents',
      description: 'Need help translating official documents from Arabic to German.',
      category: 'translation',
      location: 'Berlin, Germany',
      postedBy: 'Fatima K.',
      date: new Date(2023, 4, 10),
      urgent: false,
      status: 'open',
    },
    {
      id: '3',
      title: 'Legal assistance for asylum application',
      description: 'Looking for legal advice and help with filling asylum application forms.',
      category: 'legal',
      location: 'Munich, Germany',
      postedBy: 'Youssef M.',
      date: new Date(2023, 4, 5),
      urgent: true,
      status: 'open',
    },
    {
      id: '4',
      title: 'Medical assistance needed',
      description: 'Need access to medical care for chronic condition (diabetes).',
      category: 'medical',
      location: 'Hamburg, Germany',
      postedBy: 'Leila S.',
      date: new Date(2023, 4, 3),
      urgent: true,
      status: 'matched',
    },
    {
      id: '5',
      title: 'School supplies for children',
      description: 'Need school supplies for 2 children (ages 8 and 10).',
      category: 'education',
      location: 'Frankfurt, Germany',
      postedBy: 'Omar K.',
      date: new Date(2023, 4, 1),
      urgent: false,
      status: 'open',
    },
    {
      id: '6',
      title: 'Winter clothing needed',
      description: 'Family needs winter clothing (jackets, boots, gloves) for cold weather.',
      category: 'clothing',
      location: 'Dresden, Germany',
      postedBy: 'Amina R.',
      date: new Date(2023, 3, 28),
      urgent: false,
      status: 'open',
    },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'shelter', label: 'Shelter' },
    { value: 'food', label: 'Food' },
    { value: 'medical', label: 'Medical' },
    { value: 'legal', label: 'Legal' },
    { value: 'education', label: 'Education' },
    { value: 'translation', label: 'Translation' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'employment', label: 'Employment' },
    { value: 'other', label: 'Other' },
  ];

  const [newNeed, setNewNeed] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    urgent: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewNeed({ ...newNeed, [name]: value });
  };

  const handleSubmitNeed = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!newNeed.title || !newNeed.description || !newNeed.category) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Here you would normally send this to an API
    toast({
      title: "Need posted successfully",
      description: "Your need has been posted and is now visible to potential helpers.",
    });

    // Reset form
    setNewNeed({
      title: '',
      description: '',
      category: '',
      location: '',
      urgent: false,
    });

    // Close dialog (you would need to control this with state in a real implementation)
  };

  const filteredNeeds = needsData.filter((need) => {
    const matchesSearch = need.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          need.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || need.category === selectedCategory;
    const matchesUrgency = !showUrgentOnly || need.urgent;
    
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const getCategoryBadgeColor = (category: string) => {
    switch(category) {
      case 'shelter':
        return 'bg-blue-100 text-blue-800';
      case 'food':
        return 'bg-green-100 text-green-800';
      case 'medical':
        return 'bg-red-100 text-red-800';
      case 'legal':
        return 'bg-purple-100 text-purple-800';
      case 'education':
        return 'bg-yellow-100 text-yellow-800';
      case 'translation':
        return 'bg-indigo-100 text-indigo-800';
      case 'clothing':
        return 'bg-pink-100 text-pink-800';
      case 'employment':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Community Needs</h1>
        
        <Tabs defaultValue="browse">
          <TabsList className="mb-8">
            <TabsTrigger value="browse">Browse Needs</TabsTrigger>
            <TabsTrigger value="my-needs">My Posted Needs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for needs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
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
              
              <div className="flex items-center gap-2">
                <Checkbox
                  id="urgent-only"
                  checked={showUrgentOnly}
                  onCheckedChange={(checked) => setShowUrgentOnly(checked as boolean)}
                />
                <label htmlFor="urgent-only" className="text-sm font-medium">
                  Urgent only
                </label>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Post a Need
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Post a New Need</DialogTitle>
                    <DialogDescription>
                      Describe what you need help with. Be specific to increase chances of finding assistance.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="title" className="text-sm font-medium">Title</label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Brief title of your need"
                        value={newNeed.title}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="description" className="text-sm font-medium">Description</label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe your need in detail..."
                        value={newNeed.description}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="category" className="text-sm font-medium">Category</label>
                      <Select
                        value={newNeed.category}
                        onValueChange={(value) => setNewNeed({ ...newNeed, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.filter(cat => cat.value !== 'all').map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="location" className="text-sm font-medium">Location</label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="City, Country"
                        value={newNeed.location}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="urgent"
                        checked={newNeed.urgent}
                        onCheckedChange={(checked) => setNewNeed({ ...newNeed, urgent: checked as boolean })}
                      />
                      <label htmlFor="urgent" className="text-sm font-medium">
                        This is urgent
                      </label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleSubmitNeed}>Submit</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {filteredNeeds.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-xl font-medium mb-2">No needs found</div>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters, or post a new need.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredNeeds.map((need) => (
                  <Card key={need.id} className={need.urgent ? 'border-red-400' : ''}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{need.title}</CardTitle>
                        {need.urgent && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {need.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{need.description}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryBadgeColor(need.category)}`}>
                          {need.category}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                          Posted {need.date.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Posted by: {need.postedBy}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <div className="w-full flex justify-between">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" /> Offer Help
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="my-needs">
            {user ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Your Posted Needs</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Post a Need
                      </Button>
                    </DialogTrigger>
                    {/* Use the same dialog content as above */}
                  </Dialog>
                </div>
                
                {/* Filter to only show the current user's needs */}
                {needsData.filter(need => need.postedBy === user.name).length > 0 ? (
                  <div className="space-y-4">
                    {needsData
                      .filter(need => need.postedBy === user.name)
                      .map((need) => (
                        <Card key={need.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="font-medium">{need.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{need.description}</p>
                                <div className="flex flex-wrap gap-2">
                                  <span className={`text-xs px-2 py-1 rounded-full ${getCategoryBadgeColor(need.category)}`}>
                                    {need.category}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    need.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                                    need.status === 'matched' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'
                                  }`}>
                                    {need.status.charAt(0).toUpperCase() + need.status.slice(1)}
                                  </span>
                                  {need.urgent && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                                      Urgent
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive">
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-xl font-medium mb-2">You haven't posted any needs yet</div>
                    <p className="text-muted-foreground mb-6">
                      Post a need to get help from our community of volunteers and organizations.
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Post Your First Need
                        </Button>
                      </DialogTrigger>
                      {/* Use the same dialog content as above */}
                    </Dialog>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-xl font-medium mb-2">Please log in to view your needs</div>
                <p className="text-muted-foreground mb-6">
                  You need to be logged in to post and track your needs.
                </p>
                <Button onClick={() => navigate('/login')}>
                  Log In
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Needs;
