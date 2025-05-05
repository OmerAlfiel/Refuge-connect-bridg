import React, { useState, useRef, FormEvent } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Home, MapPin, FileText, MessageCircle, Filter, Plus, Mail, Phone, ExternalLink, Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import MapComponent, { MapComponentRef } from '@/components/MapComponent';
import { useAuth } from '@/context/AuthContext';
import { useOffers, useCreateOffer, useOfferById, useDeleteOffer } from '@/hooks/use-offers';
import { CreateOfferRequest, OfferCategory } from '@/types';

import { format } from 'date-fns';
import OfferCard from '@/components/OfferCard';


const Offers: React.FC = () => {
  const [category, setCategory] = useState<string>('all');
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState<CreateOfferRequest>({
    title: '',
    description: '',
    category: 'shelter',
    location: {
      lat: 0,
      lng: 0,
    },
    contact: {
      name: '',
      phone: '',
      email: '',
      website: ''
    }
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const mapRef = useRef<MapComponentRef>(null);
  const { isAuthenticated, user } = useAuth();
  
  // Fetch offers with optional category filter
  const offersQueryParams = category !== 'all' ? { category: category as OfferCategory } : undefined;
  const { data: offers = [], isLoading, isError } = useOffers(offersQueryParams);
  
  // Get selected offer details when dialog is open
  const { data: selectedOffer } = useOfferById(selectedOfferId || '');
  
  // Create and delete offer mutations
  const createOfferMutation = useCreateOffer();
  const deleteOfferMutation = useDeleteOffer();

  // Categories for filter dropdown
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'shelter', label: 'Shelter' },
    { value: 'food', label: 'Food' },
    { value: 'medical', label: 'Medical' },
    { value: 'legal', label: 'Legal' },
    { value: 'education', label: 'Education' },
    { value: 'translation', label: 'Translation' },
    { value: 'transportation', label: 'Transportation' },
    { value: 'employment', label: 'Employment' },
    { value: 'other', label: 'Other' },
  ];

  // Open contact dialog for an offer
  const handleContact = (offerId: string) => {
    setSelectedOfferId(offerId);
    setIsContactDialogOpen(true);
  };
  
  // Open location dialog for an offer
  const handleViewLocation = (offerId: string) => {
    setSelectedOfferId(offerId);
    setIsLocationDialogOpen(true);
  };
  
  // Navigate to resource map with selected offer
  const handleGoToResourceMap = (offerId: string) => {
    if (selectedOffer) {
      localStorage.setItem('selectedLocation', JSON.stringify({
        id: selectedOffer.id,
        name: selectedOffer.title,
        coordinates: {
          lat: selectedOffer.location?.lat || 0,
          lng: selectedOffer.location?.lng || 0
        },
        description: selectedOffer.description,
        type: selectedOffer.category
      }));
      
      navigate('/resources');
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    
    if (id.includes('.')) {
      // Handle nested properties
      const [parent, child] = id.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CreateOfferRequest] as object || {}),
          [child]: value
        }
      }));
    } else {
      // Handle top-level properties
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };
  
  // Update your handleCreateOffer function to fix the contact structure
  const handleCreateOffer = async (event: FormEvent) => {
    event.preventDefault();
    console.log("Original form data:", formData);
    
    // Create a modified version without the problematic property
    const offerData = {
      ...formData,
      location: {
        ...formData.location,
        lat: formData.location?.lat || 0,
        lng: formData.location?.lng || 0,
        city: formData.location?.city || '',
        country: formData.location?.country || ''
      },
      // Fix the contact object structure - remove the name property
      contact: {
        // Remove name property
        phone: formData.contact?.phone || '',
        email: formData.contact?.email || '',
        website: formData.contact?.website || ''
      }
    };
    
    console.log("Modified form data:", offerData);
    
    try {
      await createOfferMutation.mutateAsync(offerData);
      toast({
        title: "Offer created",
        description: "Your offer has been published successfully.",
      });
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'shelter',
        location: { lat: 0, lng: 0 },
        contact: {}
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create offer. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await deleteOfferMutation.mutateAsync(id);
        toast({
          title: "Offer deleted",
          description: "Your offer has been deleted successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete offer. Please try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return format(date, 'PP');
  };

  // Set dialog open state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter offers based on search term
  const filteredOffers = offers.filter(offer => 
    search === '' || 
    offer.title.toLowerCase().includes(search.toLowerCase()) ||
    offer.description.toLowerCase().includes(search.toLowerCase()) ||
    (offer.location?.city && offer.location.city.toLowerCase().includes(search.toLowerCase())) ||
    (offer.location?.country && offer.location.country.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout>
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Available Offers</h1>
            <p className="text-muted-foreground mt-1">
              Browse support and resources offered by volunteers and organizations
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {isAuthenticated && (user?.role === 'volunteer' || user?.role === 'ngo') && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Offer
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                  <form onSubmit={handleCreateOffer}>
                    <DialogHeader>
                      <DialogTitle>Create New Offer</DialogTitle>
                      <DialogDescription>
                        Share your resources or services to help refugees in need
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 py-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1">
                          <label htmlFor="title" className="text-sm font-medium">Title</label>
                          <Input 
                            id="title" 
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter offer title" 
                            required 
                          />
                        </div>
                        <div className="grid gap-1">
                          <label htmlFor="category" className="text-sm font-medium">Category</label>
                          <Select 
                            value={formData.category} 
                            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as OfferCategory }))}
                          >
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.slice(1).map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1">
                          <label htmlFor="location.city" className="text-sm font-medium">City</label>
                          <Input 
                            id="location.city" 
                            value={formData.location?.city || ''} 
                            onChange={handleInputChange}
                            placeholder="City" 
                          />
                        </div>
                        <div className="grid gap-1">
                          <label htmlFor="location.country" className="text-sm font-medium">Country</label>
                          <Input 
                            id="location.country" 
                            value={formData.location?.country || ''} 
                            onChange={handleInputChange}
                            placeholder="Country" 
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-1">
                        <label htmlFor="description" className="text-sm font-medium">Description</label>
                        <textarea 
                          id="description" 
                          value={formData.description}
                          onChange={handleInputChange}
                          className="min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Describe your offer in detail"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1">
                          <label htmlFor="contact.name" className="text-sm font-medium">Contact Name</label>
                          <Input 
                            id="contact.name" 
                            value={formData.contact?.name || ''}
                            onChange={handleInputChange}
                            placeholder="Contact name" 
                          />
                        </div>
                        <div className="grid gap-1">
                          <label htmlFor="contact.phone" className="text-sm font-medium">Phone</label>
                          <Input 
                            id="contact.phone" 
                            value={formData.contact?.phone || ''}
                            onChange={handleInputChange}
                            placeholder="Phone number" 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1">
                          <label htmlFor="contact.email" className="text-sm font-medium">Email</label>
                          <Input 
                            id="contact.email" 
                            type="email"
                            value={formData.contact?.email || ''}
                            onChange={handleInputChange}
                            placeholder="Email address" 
                          />
                        </div>
                        <div className="grid gap-1">
                          <label htmlFor="contact.website" className="text-sm font-medium">Website</label>
                          <Input 
                            id="contact.website" 
                            value={formData.contact?.website || ''}
                            onChange={handleInputChange}
                            placeholder="Website URL" 
                          />
                        </div>
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
        </div>
        
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search offers..."
            className="pl-10 max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex max-w-md">
            <TabsTrigger value="all">All Offers</TabsTrigger>
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
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
                {filteredOffers.map(offer => (
                  <OfferCard key={offer.id} offer={offer} onContact={handleContact} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No offers found matching your filters.</p>
                <Button variant="outline" onClick={() => {
                  setCategory('all');
                  setSearch('');
                }}>
                  <Filter className="mr-2 h-4 w-4" /> Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="nearby" className="mt-4">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Enable location services to see nearby offers.</p>
              <Button>
                <MapPin className="mr-2 h-4 w-4" /> Enable Location
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="recent" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredOffers
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 6)
                  .map(offer => (
                    <OfferCard key={offer.id} offer={offer} onContact={handleContact} />
                  ))}
              </div>
            )}
          </TabsContent>
          
          {isAuthenticated && (user?.role === 'volunteer' || user?.role === 'ngo') && (
            <TabsContent value="my-offers" className="mt-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Offers</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Create Offer
                    </Button>
                  </DialogTrigger>
                  {/* Dialog content is defined above */}
                </Dialog>
              </div>
              
              {/* User's offers will be displayed here */}
              {/* We would need to add useUserOffers() hook here */}
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Contact Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Contact {selectedOffer?.user?.name}</DialogTitle>
            <DialogDescription>
              Reach out regarding: {selectedOffer?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedOffer && (
              <>
                <div className="space-y-2 border-b pb-4">
                  <h3 className="text-sm font-medium">Direct Contact</h3>
                  
                  {selectedOffer.contact?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedOffer.contact.phone}</span>
                    </div>
                  )}
                  
                  {selectedOffer.contact?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedOffer.contact.email}</span>
                    </div>
                  )}

                  {selectedOffer.contact?.website && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <a href={selectedOffer.contact.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                        {selectedOffer.contact.website}
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Send a Message</h3>
                  
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm">Your Name</label>
                    <Input id="name" placeholder="Enter your name" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm">Your Email</label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm">Your Message</label>
                    <textarea 
                      id="message" 
                      className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground"
                      placeholder="Enter your message..." 
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContactDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setIsContactDialogOpen(false);
              toast({
                title: "Message sent",
                description: "Your message has been sent successfully.",
              });
            }}>
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Location Dialog */}
      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              <MapPin className="inline-block mr-2 h-5 w-5" />
              Location: {selectedOffer?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {selectedOffer && selectedOffer.location?.lat && selectedOffer.location?.lng && (
              <>
                <div className="w-full h-[250px] rounded-md overflow-hidden mb-2">
                  <MapComponent 
                    height="250px" 
                    zoom={14} 
                    center={[selectedOffer.location.lng, selectedOffer.location.lat]}
                    locations={[{
                      id: selectedOffer.id,
                      name: selectedOffer.title,
                      coordinates: {
                        lat: selectedOffer.location.lat,
                        lng: selectedOffer.location.lng
                      },
                      description: selectedOffer.description,
                      type: selectedOffer.category
                    }]}
                  />
                </div>
                
                <p className="text-sm mb-2">
                  <span className="font-medium">Address:</span> {selectedOffer.location.address || `${selectedOffer.location.city}, ${selectedOffer.location.country}`}
                </p>
                
                <p className="text-sm mb-4">
                  <span className="font-medium">Offered by:</span> {selectedOffer.user?.name || 'Anonymous'}
                </p>

                <div className="flex justify-between pt-2">
                  <Button variant="outline" onClick={() => setIsLocationDialogOpen(false)}>
                    Close
                  </Button>
                  
                  <Button onClick={() => {
                    setIsLocationDialogOpen(false);
                    handleGoToResourceMap(selectedOffer.id);
                  }}>
                    <MapPin className="mr-2 h-4 w-4" />
                    See on Full Map
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

// Helper function to get icon for offer category
function getCategoryIcon(category: string) {
  switch(category) {
    case 'shelter':
      return <Home className="h-4 w-4" />;
    case 'food':
      return <FileText className="h-4 w-4" />;
    case 'legal':
      return <FileText className="h-4 w-4" />;
    case 'education':
      return <FileText className="h-4 w-4" />;
    case 'medical':
      return <Heart className="h-4 w-4" />;
    case 'translation':
      return <MessageCircle className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

// Helper function to get background color based on category
function getCategoryColor(category: string) {
  switch(category) {
    case 'shelter':
      return 'volunteer-100 text-volunteer-700';
    case 'food':
      return 'orange-100 text-orange-700';
    case 'legal':
      return 'blue-100 text-blue-700';
    case 'education':
      return 'indigo-100 text-indigo-700';
    case 'medical':
      return 'red-100 text-red-700';
    case 'translation':
      return 'green-100 text-green-700';
    default:
      return 'muted-100 text-muted-700';
  }
}

export default Offers;