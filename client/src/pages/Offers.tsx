
import React, { useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Home, MapPin, FileText, MessageCircle, Filter, Plus, Mail, Phone, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import MapComponent, { MapComponentRef } from '@/components/MapComponent';

const Offers: React.FC = () => {
  const [category, setCategory] = useState<string>('all');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const mapRef = useRef<MapComponentRef>(null);
  
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'shelter', label: 'Shelter' },
    { value: 'food', label: 'Food' },
    { value: 'medical', label: 'Medical' },
    { value: 'legal', label: 'Legal' },
    { value: 'education', label: 'Education' },
    { value: 'translation', label: 'Translation' },
  ];
  
  const offersList = [
    {
      id: '1',
      title: 'Room available for 2 weeks',
      category: 'shelter',
      location: 'Berlin, Germany',
      provider: 'Sarah Miller',
      description: 'I have a spare room available for a refugee individual or small family for 2 weeks. Private bathroom included.',
      postedAt: new Date(2023, 4, 15),
      coordinates: { lat: 52.52, lng: 13.405 },
      contactInfo: {
        phone: '+49 30 123456789',
        email: 'sarah.miller@example.com'
      }
    },
    {
      id: '2',
      title: 'Weekly food packages',
      category: 'food',
      location: 'Berlin, Germany',
      provider: 'Food Bank Initiative',
      description: 'Free weekly food packages available for refugee families. Includes fresh produce, canned goods, and essential items.',
      postedAt: new Date(2023, 4, 12),
      coordinates: { lat: 52.51, lng: 13.41 },
      contactInfo: {
        phone: '+49 30 987654321',
        email: 'contact@foodbank.org'
      }
    },
    {
      id: '3',
      title: 'Free legal consultation',
      category: 'legal',
      location: 'Remote',
      provider: 'Legal Aid Society',
      description: 'Pro bono legal consultation for asylum applications and immigration procedures. Available in English, Arabic, and Farsi.',
      postedAt: new Date(2023, 4, 10),
      coordinates: { lat: 52.53, lng: 13.39 },
      contactInfo: {
        phone: '+49 30 555444333',
        email: 'help@legalaid.org'
      }
    },
    {
      id: '4',
      title: 'English language tutoring',
      category: 'education',
      location: 'Remote',
      provider: 'James Wilson',
      description: 'Free English language lessons for beginners. Online sessions twice a week, flexible scheduling.',
      postedAt: new Date(2023, 4, 8),
      coordinates: { lat: 52.50, lng: 13.42 },
      contactInfo: {
        phone: '+49 30 111222333',
        email: 'james.wilson@eduhelp.org'
      }
    },
    {
      id: '5',
      title: 'Medical checkups',
      category: 'medical',
      location: 'Munich, Germany',
      provider: 'Refugee Health Initiative',
      description: 'Free basic medical checkups and consultations. Services available in multiple languages.',
      postedAt: new Date(2023, 4, 5),
      coordinates: { lat: 48.14, lng: 11.58 },
      contactInfo: {
        phone: '+49 89 123456789',
        email: 'care@refugeehealth.org'
      }
    },
  ];
  
  const filteredOffers = category === 'all' 
    ? offersList 
    : offersList.filter(offer => offer.category === category);
    
  const handleContact = (offerId: string) => {
    const offer = offersList.find(o => o.id === offerId);
    if (offer) {
      setSelectedOffer(offer);
      setIsContactDialogOpen(true);
    }
  };
  
  const handleViewLocation = (offerId: string) => {
    const offer = offersList.find(o => o.id === offerId);
    if (offer) {
      setSelectedOffer(offer);
      setIsLocationDialogOpen(true);
    }
  };
  
  const handleGoToResourceMap = (offerId: string) => {
    const offer = offersList.find(o => o.id === offerId);
    if (offer) {
      // Save the selected location to localStorage to use it on the map page
      localStorage.setItem('selectedLocation', JSON.stringify({
        id: offer.id,
        name: offer.title,
        description: offer.description,
        coordinates: offer.coordinates,
        type: offer.category
      }));
      
      // Navigate to resource map page
      navigate('/resource-map');
    }
  };
  
  const handleCreateOffer = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
      title: "Offer created",
      description: "Your offer has been published successfully.",
    });
  };

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
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Create Offer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleCreateOffer}>
                  <DialogHeader>
                    <DialogTitle>Create New Offer</DialogTitle>
                    <DialogDescription>
                      Share your resources or services to help refugees in need
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="title" className="text-sm font-medium">Title</label>
                      <Input id="title" placeholder="Enter offer title" required />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="category" className="text-sm font-medium">Category</label>
                      <Select defaultValue="shelter">
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
                    <div className="grid gap-2">
                      <label htmlFor="location" className="text-sm font-medium">Location</label>
                      <Input id="location" placeholder="City, Country or Remote" required />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="description" className="text-sm font-medium">Description</label>
                      <textarea 
                        id="description" 
                        className="min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Describe your offer in detail"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Publish Offer</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="w-full md:w-auto grid grid-cols-3 md:inline-flex max-w-md">
            <TabsTrigger value="all">All Offers</TabsTrigger>
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            {filteredOffers.length > 0 ? (
              <div className="grid gap-4">
                {filteredOffers.map((offer) => (
                  <Card key={offer.id} className={offer.category === 'shelter' ? 'border-volunteer-300' : ''}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                            <div className={`p-2 rounded-full bg-${offer.category === 'shelter' ? 'volunteer' : 'muted'}-100 text-${offer.category === 'shelter' ? 'volunteer' : 'muted'}-700 mt-1`}>
                              {offer.category === 'shelter' && <Home className="h-4 w-4" />}
                              {offer.category === 'food' && <FileText className="h-4 w-4" />}
                              {offer.category === 'legal' && <FileText className="h-4 w-4" />}
                              {offer.category === 'education' && <FileText className="h-4 w-4" />}
                              {offer.category === 'medical' && <FileText className="h-4 w-4" />}
                              {offer.category === 'translation' && <MessageCircle className="h-4 w-4" />}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg mb-1">{offer.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                <span className="capitalize">{offer.category}</span> • {offer.location} • 
                                Posted {offer.postedAt.toLocaleDateString()}
                              </p>
                              <p className="text-sm mb-2">By {offer.provider}</p>
                              <p className="text-sm text-muted-foreground">{offer.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-4 md:mt-0 md:ml-4">
                          <Button onClick={() => handleContact(offer.id)}>
                            <MessageCircle className="mr-2 h-4 w-4" /> Contact
                          </Button>
                          <Button variant="outline" onClick={() => handleViewLocation(offer.id)}>
                            <MapPin className="mr-2 h-4 w-4" /> View Location
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No offers found matching your filters.</p>
                <Button variant="outline" onClick={() => setCategory('all')}>
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
            {filteredOffers
              .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime())
              .slice(0, 3)
              .map((offer) => (
                <Card key={offer.id} className="mb-4">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{offer.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="capitalize">{offer.category}</span> • {offer.location} • 
                          Posted {offer.postedAt.toLocaleDateString()}
                        </p>
                        <p className="text-sm mb-2">By {offer.provider}</p>
                        <p className="text-sm text-muted-foreground">{offer.description}</p>
                      </div>
                      <div className="flex gap-2 mt-4 md:mt-0 md:ml-4">
                        <Button onClick={() => handleContact(offer.id)}>Contact</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Contact Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Contact {selectedOffer?.provider}</DialogTitle>
            <DialogDescription>
              Reach out regarding: {selectedOffer?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedOffer && (
              <>
                <div className="space-y-2 border-b pb-4">
                  <h3 className="text-sm font-medium">Direct Contact</h3>
                  
                  {selectedOffer.contactInfo?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedOffer.contactInfo.phone}</span>
                    </div>
                  )}
                  
                  {selectedOffer.contactInfo?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedOffer.contactInfo.email}</span>
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
            {selectedOffer && (
              <>
                <div className="w-full h-[250px] rounded-md overflow-hidden mb-2">
                  <MapComponent 
                    height="250px" 
                    zoom={14} 
                    center={[selectedOffer.coordinates.lng, selectedOffer.coordinates.lat]}
                    locations={[{
                      id: selectedOffer.id,
                      name: selectedOffer.title,
                      coordinates: selectedOffer.coordinates,
                      description: selectedOffer.description,
                      type: selectedOffer.category
                    }]}
                  />
                </div>
                
                <p className="text-sm mb-2">
                  <span className="font-medium">Address:</span> {selectedOffer.location}
                </p>
                
                <p className="text-sm mb-4">
                  <span className="font-medium">Offered by:</span> {selectedOffer.provider}
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

export default Offers;
