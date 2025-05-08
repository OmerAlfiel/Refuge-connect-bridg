import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { MapPin, Search, Plus, FileText, MessageCircle, ExternalLink, Mail, Phone, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MapComponent, { MapComponentRef } from '@/components/MapComponent';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { LocationType } from '@/types';
import { locationsService } from '@/services/locationsService';

const MapPage: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [filteredLocations, setFilteredLocations] = useState<LocationType[]>([]);
  const { toast } = useToast();
  const mapRef = useRef<MapComponentRef>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [activeLocation, setActiveLocation] = useState<LocationType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'resource',
    address: '',
    description: '',
    services: '',
    coordinates: { lat: 0, lng: 0 },
    contactInfo: {
      phone: '',
      email: '',
      website: '',
      hours: ''
    }
  });

  // Get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
          setUserLocation({ lat: 52.52, lng: 13.405 });
        }
      );
    } else {
      setUserLocation({ lat: 52.52, lng: 13.405 });
    }
  }, []);

  // Fetch locations when user location is set
  useEffect(() => {
    const fetchLocations = async () => {
      if (userLocation) {
        try {
          setIsLoading(true);
          const locations = await locationsService.getAll({
            lat: userLocation.lat,
            lng: userLocation.lng,
            radius: 50
          });
          setFilteredLocations(locations);
        } catch (error) {
          console.error('Failed to fetch locations:', error);
          toast({
            title: "Error",
            description: "Failed to load resource locations.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchLocations();
  }, [userLocation, toast]);

  // Update filter handling with API calls
  useEffect(() => {
    const fetchFilteredLocations = async () => {
      try {
        setIsLoading(true);
        const locations = await locationsService.getAll({
          search: searchQuery,
          type: activeFilter !== 'all' ? activeFilter : undefined,
          lat: userLocation?.lat,
          lng: userLocation?.lng,
          radius: 50
        });
        setFilteredLocations(locations);
      } catch (error) {
        console.error('Failed to fetch filtered locations:', error);
        toast({
          title: "Error",
          description: "Failed to filter resources.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredLocations();
  }, [searchQuery, activeFilter, userLocation, toast]);

  // Update form handling
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => {
        const parentObj = prev[parent as keyof typeof prev];
        return {
          ...prev,
          [parent]: typeof parentObj === 'object' && parentObj !== null 
            ? { ...parentObj, [child]: value } 
            : { [child]: value }
        };
      });
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Update resource submission
  const handleAddResource = async () => {
    try {
      const servicesArray = formData.services.split(',').map(s => s.trim()).filter(Boolean);
      await locationsService.create({
        ...formData,
        services: servicesArray,
        coordinates: userLocation || { lat: 52.52, lng: 13.405 }
      });
      
      setIsAddDialogOpen(false);
      toast({
        title: "Resource submitted",
        description: "Your resource has been submitted successfully.",
      });
      
      // Reset form and refresh locations
      setFormData({
        name: '',
        type: 'resource',
        address: '',
        description: '',
        services: '',
        coordinates: { lat: 0, lng: 0 },
        contactInfo: { phone: '', email: '', website: '', hours: '' }
      });
      
      if (userLocation) {
        const locations = await locationsService.getAll({
          lat: userLocation.lat,
          lng: userLocation.lng,
          radius: 50
        });
        setFilteredLocations(locations);
      }
    } catch (error) {
      console.error('Error adding resource:', error);
      toast({
        title: "Error",
        description: "Failed to add resource. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLocationClick = (locationId: string) => {
    setSelectedLocation(locationId);
    
    // Find the location and fly to it on the map
    const location = filteredLocations.find(loc => loc.id === locationId);
    if (location && mapRef.current) {
      mapRef.current.flyTo(location.coordinates.lng, location.coordinates.lat);
    }
  };
  
  const handleGetDirections = () => {
    // Find the selected location
    const location = filteredLocations.find(loc => loc.id === selectedLocation);
    
    if (location && mapRef.current) {
      // Fly to the location with animation
      mapRef.current.flyTo(location.coordinates.lng, location.coordinates.lat, 16);
      
      toast({
        title: "Showing directions",
        description: `Navigating to ${location.name}`,
      });
    }
  };

  const handleDetailsClick = (locationId: string) => {
    const location = filteredLocations.find(loc => loc.id === locationId);
    if (location) {
      setActiveLocation(location);
      setIsDetailsDialogOpen(true);
    }
  };

  const handleContactClick = (locationId: string) => {
    const location = filteredLocations.find(loc => loc.id === locationId);
    if (location) {
      setActiveLocation(location);
      setIsContactDialogOpen(true);
    }
  };
  
  // Initialize filtered locations on component mount
  useEffect(() => {
    setFilteredLocations([]);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medical': return 'bg-red-100 text-red-800';
      case 'housing': return 'bg-blue-100 text-blue-800';
      case 'employment': return 'bg-green-100 text-green-800';
      case 'legal': return 'bg-purple-100 text-purple-800';
      case 'education': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resource Map</h1>
            <p className="text-muted-foreground mt-1">
              Find resources, services and support locations
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search locations..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Resource</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Resource name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="type" className="text-sm font-medium">Type</label>
                    <Select
                      name="type"
                      value={formData.type}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select resource type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="housing">Housing</SelectItem>
                        <SelectItem value="employment">Employment</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="resource">General Resource</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="address" className="text-sm font-medium">Address</label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      placeholder="Full address"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="services" className="text-sm font-medium">Services (comma separated)</label>
                    <Input
                      id="services"
                      name="services"
                      value={formData.services}
                      onChange={handleFormChange}
                      placeholder="Service 1, Service 2, etc."
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <Input
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      placeholder="Brief description of the resource"
                      required
                    />
                  </div>
                </div>
                <Button onClick={handleAddResource} disabled={!isAuthenticated}>
                  Submit Resource
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Filters</CardTitle>
                <CardDescription>Filter resources by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant={activeFilter === 'all' ? 'default' : 'outline'} 
                    className="justify-start w-full"
                    onClick={() => setActiveFilter('all')}
                  >
                    All Resources
                  </Button>
                  <Button 
                    variant={activeFilter === 'medical' ? 'default' : 'outline'} 
                    className="justify-start w-full"
                    onClick={() => setActiveFilter('medical')}
                  >
                    Medical Services
                  </Button>
                  <Button 
                    variant={activeFilter === 'housing' ? 'default' : 'outline'} 
                    className="justify-start w-full"
                    onClick={() => setActiveFilter('housing')}
                  >
                    Housing & Shelter
                  </Button>
                  <Button 
                    variant={activeFilter === 'legal' ? 'default' : 'outline'} 
                    className="justify-start w-full"
                    onClick={() => setActiveFilter('legal')}
                  >
                    Legal Assistance
                  </Button>
                  <Button 
                    variant={activeFilter === 'education' ? 'default' : 'outline'} 
                    className="justify-start w-full"
                    onClick={() => setActiveFilter('education')}
                  >
                    Education & Training
                  </Button>
                  <Button 
                    variant={activeFilter === 'employment' ? 'default' : 'outline'} 
                    className="justify-start w-full"
                    onClick={() => setActiveFilter('employment')}
                  >
                    Employment Services
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Nearby Resources</CardTitle>
                <CardDescription>Click to view details</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[300px] overflow-y-auto">
                <div className="space-y-2">
                  {filteredLocations.map(location => (
                    <div 
                      key={location.id}
                      className={`p-3 border rounded-md cursor-pointer hover:bg-muted/50 ${selectedLocation === location.id ? 'border-primary bg-muted/50' : ''}`}
                      onClick={() => handleLocationClick(location.id)}
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-1 text-primary" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-medium">{location.name}</p>
                            <Badge className={`text-xs ${getTypeColor(location.type)}`}>{location.type}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{location.address}</p>
                          {location.services && location.services.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {location.services.slice(0, 2).map((service: string, idx: number) => (
                                <span key={idx} className="text-xs bg-muted px-1.5 py-0.5 rounded-full">
                                  {service}
                                </span>
                              ))}
                              {location.services.length > 2 && (
                                <span className="text-xs text-muted-foreground">+{location.services.length - 2} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredLocations.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No resources match your filters</p>
                      <Button 
                        variant="link" 
                        onClick={() => { 
                          setActiveFilter('all');
                          setSearchQuery('');
                        }}
                      >
                        Reset filters
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Your Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[150px] rounded-md overflow-hidden mb-2">
                  <MapComponent 
                    height="150px" 
                    zoom={12} 
                    center={[13.405, 52.52]}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Berlin, Germany</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2 h-full">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <div className="relative h-full" style={{ minHeight: '600px' }}>
                  <MapComponent 
                    ref={mapRef}
                    locations={filteredLocations} 
                    height="100%" 
                    onMarkerClick={handleLocationClick}
                  />
                  
                  {selectedLocation && (
                    <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm p-4 border-t">
                      {filteredLocations.find(l => l.id === selectedLocation) && (
                        <>
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-lg">
                              {filteredLocations.find(l => l.id === selectedLocation)?.name}
                            </h3>
                            <Badge className={getTypeColor(filteredLocations.find(l => l.id === selectedLocation)?.type || '')}>
                              {filteredLocations.find(l => l.id === selectedLocation)?.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {filteredLocations.find(l => l.id === selectedLocation)?.address}
                          </p>
                          <p className="text-sm mb-3">
                            {filteredLocations.find(l => l.id === selectedLocation)?.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {filteredLocations
                              .find(l => l.id === selectedLocation)
                              ?.services.map((service: string, i: number) => (
                                <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full">
                                  {service}
                                </span>
                              ))
                            }
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleGetDirections} className="flex items-center">
                              <MapPin className="mr-2 h-4 w-4" /> Get Directions
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleContactClick(selectedLocation)}
                            >
                              <MessageCircle className="mr-2 h-4 w-4" /> Contact
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleDetailsClick(selectedLocation)}
                            >
                              <FileText className="mr-2 h-4 w-4" /> Details
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {activeLocation?.name} Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {activeLocation && (
              <>
                <div className="w-full h-[200px] rounded-md overflow-hidden mb-2">
                  <MapComponent 
                    height="200px" 
                    zoom={15} 
                    center={[activeLocation.coordinates.lng, activeLocation.coordinates.lat]}
                    locations={[activeLocation]}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getTypeColor(activeLocation.type)}>
                    {activeLocation.type}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{activeLocation.address}</span>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Description</h3>
                  <p className="text-sm">{activeLocation.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Services</h3>
                  <div className="flex flex-wrap gap-1">
                    {activeLocation.services.map((service: string, i: number) => (
                      <Badge key={i} variant="outline">{service}</Badge>
                    ))}
                  </div>
                </div>
                
                {activeLocation.contactInfo && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Contact Information</h3>
                    
                    {activeLocation.contactInfo.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{activeLocation.contactInfo.phone}</span>
                      </div>
                    )}
                    
                    {activeLocation.contactInfo.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{activeLocation.contactInfo.email}</span>
                      </div>
                    )}
                    
                    {activeLocation.contactInfo.hours && (
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{activeLocation.contactInfo.hours}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                    Close
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      setIsDetailsDialogOpen(false);
                      if (mapRef.current && activeLocation) {
                        mapRef.current.flyTo(
                          activeLocation.coordinates.lng,
                          activeLocation.coordinates.lat, 
                          16
                        );
                      }
                    }}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Get Directions
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[400px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact {activeLocation?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 py-2">
            {activeLocation && activeLocation.contactInfo && (
              <>
                <div className="space-y-3 border-b pb-3">
                  <h3 className="text-xs font-medium">Direct Contact</h3>
                  
                  {activeLocation.contactInfo.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{activeLocation.contactInfo.phone}</span>
                    </div>
                  )}
                  
                  {activeLocation.contactInfo.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{activeLocation.contactInfo.email}</span>
                    </div>
                  )}
                  
                  {activeLocation.contactInfo.website && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      <a 
                        href={activeLocation.contactInfo.website} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  
                  {activeLocation.contactInfo.hours && (
                    <div className="flex items-center gap-2">
                      <Info className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{activeLocation.contactInfo.hours}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-medium">Send a Message</h3>
                  
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-xs">Your Name</label>
                    <Input id="name" placeholder="Enter your name" className="h-8 text-xs" />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-xs">Your Email</label>
                    <Input id="email" type="email" placeholder="Enter your email" className="h-8 text-xs" />
                  </div>
                  
                  <div className="space-y-1">
                    <label htmlFor="message" className="text-xs">Your Message</label>
                    <Textarea 
                      id="message" 
                      placeholder="Enter your message..." 
                      className="min-h-[100px] text-xs" 
                    />
                  </div>
                  
                  <Button 
                    className="w-full h-8 text-xs"
                    onClick={() => {
                      setIsContactDialogOpen(false);
                      toast({
                        title: "Message sent",
                        description: `Your message to ${activeLocation.name} has been sent.`,
                      });
                    }}
                  >
                    Send Message
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

export default MapPage;
