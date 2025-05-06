import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useOffers, useCreateOffer, useUpdateOffer, useDeleteOffer, useUserOffers } from '@/hooks/use-offers';
import { CreateOfferRequest, OfferCategory, OfferStatus } from '@/types';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Plus, Loader2, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { OfferDetail } from '@/components/OfferDetail';
import { useCreateMatch } from '@/hooks/use-matches';


const Offers: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const createMatchMutation = useCreateMatch();
  
  // Form state for creating a new offer
  const [newOffer, setNewOffer] = useState<{
    title: string;
    description: string;
    category: string;
    location: string;
  }>({
    title: '',
    description: '',
    category: 'shelter',
    location: '',
  });
  
  // Fetch offers with filter params
  const offersQueryParams = selectedCategory !== 'all' ? { category: selectedCategory as OfferCategory } : undefined;
  const { data: offers = [], isLoading, isError } = useOffers(offersQueryParams);
  
  // Get user's offers for the "My Offers" tab
  const { data: userOffers = [], isLoading: isLoadingUserOffers } = useUserOffers();
  
  // Find selected offer when dialog is open
  const selectedOffer = selectedOfferId ? offers.find(offer => offer.id === selectedOfferId) : null;
  
  // Mutations
  const createOfferMutation = useCreateOffer();
  const updateOfferMutation = useUpdateOffer();
  const deleteOfferMutation = useDeleteOffer();
  
  // Categories for filter dropdown
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'shelter', label: 'Shelter' },
    { value: 'housing', label: 'Housing' },
    { value: 'food', label: 'Food' },
    { value: 'medical', label: 'Medical' },
    { value: 'legal', label: 'Legal' },
    { value: 'education', label: 'Education' },
    { value: 'translation', label: 'Translation' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'employment', label: 'Employment' },
    { value: 'other', label: 'Other' },
  ];
  
  // Filter offers based on search query
  const filteredOffers = offers.filter(
    (offer) =>
      (searchQuery === '' ||
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory === 'all' || offer.category === selectedCategory)
  );
  
  // Handler for creating a new offer
  const handleCreateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createOfferMutation.mutateAsync({
        title: newOffer.title,
        description: newOffer.description,
        category: newOffer.category as OfferCategory,
        location: newOffer.location ? {
          lat: 0,
          lng: 0,
          address: newOffer.location,
          city: newOffer.location.split(',')[0]?.trim() || '',
          country: newOffer.location.split(',')[1]?.trim() || ''
        } : undefined,
        
        contact: {
          // Safe access for phone property
          phone: user?.contact && typeof user.contact === 'object' ? 
            // Now TypeScript knows user.contact is non-null and an object
            'phone' in (user.contact as Record<string, unknown>) ? String((user.contact as Record<string, unknown>).phone || '') : '' 
            : '',
            
          // Safe access for email property
          email: user?.contact && typeof user.contact === 'object' ? 
            'email' in (user.contact as Record<string, unknown>) ? String((user.contact as Record<string, unknown>).email || '') : ''
            : '',
            
          website: ''
        }
      });

      toast({
        title: "Offer created successfully",
        description: "Your offer has been published and is now visible to those in need.",
      });

      // Reset form & close dialog
      setNewOffer({
        title: '',
        description: '',
        category: 'shelter',
        location: '',
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error creating offer",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Handler for updating offer status
  const handleUpdateStatus = async (offerId: string, status: OfferStatus) => {
    try {
      await updateOfferMutation.mutateAsync({
        id: offerId,
        offer: { status }
      });
      
      toast({
        title: "Offer updated",
        description: `Your offer has been ${status === 'cancelled' ? 'cancelled' : 'marked as ' + status}.`,
      });
    } catch (error) {
      toast({
        title: "Error updating offer",
        description: "Failed to update offer status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handler for deleting an offer
  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm("Are you sure you want to delete this offer? This cannot be undone.")) {
      return;
    }
    
    try {
      await deleteOfferMutation.mutateAsync(offerId);
      
      toast({
        title: "Offer deleted",
        description: "Your offer has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error deleting offer",
        description: "Failed to delete offer. Please try again.",
        variant: "destructive",
      });
    }
  };
  // Replace the handleRequestMatch function with this implementation
  const handleRequestMatch = async (offerId: string, message: string) => {
    try {
      // Call the actual API to create a match
      if (!user) return Promise.reject("User not authenticated");
      
      // Import createMatchMutation at the top of your component
      await createMatchMutation.mutateAsync({
        needId: null, // Direct match request without a specific need
        offerId: offerId,
        message: message,
      });
      
      toast({
        title: "Match requested",
        description: "Your request has been sent to the offer provider.",
      });
      return Promise.resolve();
    } catch (error) {
      console.error("Error requesting match:", error);
      toast({
        title: "Error",
        description: "Failed to create match. Please try again.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };
  
  
  
  
  // Helper function to get category badge color
  const getCategoryBadgeColor = (category: string) => {
    switch(category) {
      case 'shelter': return 'bg-blue-100 text-blue-800';
      case 'food': return 'bg-green-100 text-green-800';
      case 'medical': return 'bg-red-100 text-red-800';
      case 'legal': return 'bg-purple-100 text-purple-800';
      case 'education': return 'bg-yellow-100 text-yellow-800';
      case 'translation': return 'bg-indigo-100 text-indigo-800';
      case 'employment': return 'bg-orange-100 text-orange-800';
      case 'clothing': return 'bg-pink-100 text-pink-800';
      case 'transportation': return 'bg-cyan-100 text-cyan-800';
      case 'housing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="container px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0 lg:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Offers</h1>
            <p className="text-muted-foreground">
              Browse support and services provided by volunteers and organizations
            </p>
          </div>
          
          {user && (user.role === 'volunteer' || user.role === 'ngo') && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create Offer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Offer</DialogTitle>
                  <DialogDescription>
                    Share your resources or services to help refugees in need
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateOffer}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="title" className="text-sm font-medium">Title</label>
                      <Input
                        id="title"
                        value={newOffer.title}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Brief title of your offer"
                        required
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="category" className="text-sm font-medium">Category</label>
                      <Select
                        value={newOffer.category}
                        onValueChange={(value) => setNewOffer(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(1).map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="location" className="text-sm font-medium">Location</label>
                      <Input
                        id="location"
                        value={newOffer.location}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City, Country"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <label htmlFor="description" className="text-sm font-medium">Description</label>
                      <textarea
                        id="description"
                        value={newOffer.description}
                        onChange={(e) => setNewOffer(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your offer in detail..."
                        rows={4}
                        className="min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={createOfferMutation.isPending}
                    >
                      {createOfferMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Publish Offer
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 my-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search offers..."
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
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Tabs defaultValue="all-offers" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="all-offers">All Offers</TabsTrigger>
            {user && <TabsTrigger value="my-offers">My Offers</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="all-offers" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">Failed to load offers. Please try again later.</p>
                <Button onClick={() => window.location.reload()}>Refresh</Button>
              </div>
            ) : filteredOffers.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredOffers.map((offer) => (
                  <Card key={offer.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{offer.title}</CardTitle>
                        <Badge className={getCategoryBadgeColor(offer.category)}>
                          {offer.category}
                        </Badge>
                      </div>
                      <CardDescription>
                        {offer.location?.city}, {offer.location?.country}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="line-clamp-2 text-sm mb-2">
                        {offer.description}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                          Posted {format(new Date(offer.createdAt), 'PP')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Posted by: {offer.user?.name || 'Anonymous'}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="pt-0">
                      <div className="w-full flex justify-between">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-muted-foreground"
                          onClick={() => {
                            setSelectedOfferId(offer.id);
                            setIsDetailDialogOpen(true);
                          }}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedOfferId(offer.id);
                            setIsDetailDialogOpen(true);
                          }}
                        >
                          <MessageSquare className="h-4 w-4 mr-1" /> Contact
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No offers found matching your filters.</p>
                <Button variant="outline" onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}>
                  <Filter className="mr-2 h-4 w-4" /> Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="my-offers" className="space-y-4">
            {user ? (
              <div>
                {isLoadingUserOffers ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : userOffers.length > 0 ? (
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {userOffers.map((offer) => (
                      <Card key={offer.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div>
                              <CardTitle className="text-lg">{offer.title}</CardTitle>
                              <CardDescription className="flex items-center gap-2">
                                <Badge className={getCategoryBadgeColor(offer.category)}>
                                  {offer.category}
                                </Badge>
                                <Badge
                                  className={
                                    offer.status === 'active'
                                      ? 'bg-green-100 text-green-800'
                                      : offer.status === 'paused'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }
                                >
                                  {offer.status}
                                </Badge>
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="line-clamp-2 text-sm mb-2">
                            {offer.description}
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                              Posted {format(new Date(offer.createdAt), 'PP')}
                            </span>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="pt-0">
                          <div className="w-full flex flex-col gap-2">
                            <div className="w-full">
                              {offer.status === 'active' && (
                                <Select
                                  onValueChange={(value) => handleUpdateStatus(offer.id, value as OfferStatus)}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Update Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="paused">Pause Offer</SelectItem>
                                    <SelectItem value="completed">Mark as Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancel Offer</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive"
                              onClick={() => handleDeleteOffer(offer.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-xl font-medium mb-2">You haven't created any offers yet</div>
                    <p className="text-muted-foreground mb-6">
                      Create an offer to help refugees and those in need.
                    </p>
                    <DialogTrigger asChild>
                      <Button onClick={() => setIsDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Offer
                      </Button>
                    </DialogTrigger>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-xl font-medium mb-2">Sign in to manage your offers</div>
                <p className="text-muted-foreground mb-6">
                  Create an account or sign in to create and manage your offers.
                </p>
                <Button onClick={() => navigate('/login')}>
                  Sign In
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Offer Details Dialog */}
        {selectedOffer && (
          <OfferDetail
            offer={selectedOffer}
            isOpen={isDetailDialogOpen}
            onClose={() => setIsDetailDialogOpen(false)}
            onRequestMatch={handleRequestMatch}
          />
        )}
      </div>
    </Layout>
  );
};

export default Offers;