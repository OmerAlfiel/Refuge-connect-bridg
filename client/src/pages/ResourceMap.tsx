import React, { useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, MapPin, FileText, ExternalLink, MessageCircle, Mail, Phone, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import MapComponent, { MapComponentRef } from '@/components/MapComponent';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

const ResourceMap: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistance, setSelectedDistance] = useState<string>('5');
  const mapRef = useRef<MapComponentRef>(null);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const { toast } = useToast();
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [activeResource, setActiveResource] = useState<any>(null);
  
  // Sample resource data
  const resources = [
    {
      id: '1',
      name: 'Central Refugee Support Center',
      category: 'support center',
      address: '123 Main St, Berlin, Germany',
      description: 'Provides housing assistance, food, clothing, and general information for refugees.',
      services: ['Housing', 'Food', 'Clothing', 'Information'],
      openHours: 'Mon-Fri: 9am-5pm',
      distance: 1.2,
      coordinates: { lat: 52.52, lng: 13.405 },
      contactInfo: {
        phone: '+49 30 123456789',
        email: 'support@refugee-center.org',
        website: 'https://refugee-center.org',
        hours: 'Mon-Fri: 9am-5pm'
      }
    },
    {
      id: '2',
      name: 'Community Legal Aid',
      category: 'legal',
      address: '456 Legal Ave, Berlin, Germany',
      description: 'Free legal advice and representation for asylum applications and immigration issues.',
      services: ['Legal Advice', 'Documentation Help', 'Asylum Support'],
      openHours: 'Mon-Thu: 10am-4pm',
      distance: 2.5,
      coordinates: { lat: 52.51, lng: 13.41 },
      contactInfo: {
        phone: '+49 30 987654321',
        email: 'info@legal-aid.org',
        website: 'https://legal-aid.org',
        hours: 'Mon-Thu: 10am-4pm'
      }
    },
    {
      id: '3',
      name: 'International Medical Center',
      category: 'medical',
      address: '789 Health Blvd, Berlin, Germany',
      description: 'Medical care and mental health services for refugees, with translators available.',
      services: ['Medical Care', 'Mental Health', 'Translation'],
      openHours: 'Mon-Sun: 8am-8pm',
      distance: 3.8,
      coordinates: { lat: 52.53, lng: 13.39 },
    },
    {
      id: '4',
      name: 'Language Learning Hub',
      category: 'education',
      address: '321 Education Rd, Berlin, Germany',
      description: 'Free language classes in German, English, and French for refugees of all ages.',
      services: ['Language Classes', 'Tutoring', 'Computer Access'],
      openHours: 'Mon-Sat: 9am-7pm',
      distance: 4.2,
      coordinates: { lat: 52.50, lng: 13.42 },
    },
    {
      id: '5',
      name: 'Refugee Employment Network',
      category: 'employment',
      address: '654 Work St, Berlin, Germany',
      description: 'Job placement, resume help, and vocational training for refugees seeking employment.',
      services: ['Job Placement', 'Resume Help', 'Training'],
      openHours: 'Mon-Fri: 9am-6pm',
      distance: 5.5,
      coordinates: { lat: 52.49, lng: 13.44 },
    },
    {
      id: '6',
      name: 'Child Care and Family Center',
      category: 'family',
      address: '987 Family Cir, Berlin, Germany',
      description: 'Child care services, parenting support, and activities for refugee families.',
      services: ['Child Care', 'Family Support', 'Activities'],
      openHours: 'Mon-Fri: 8am-6pm',
      distance: 6.7,
      coordinates: { lat: 52.48, lng: 13.43 },
    },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'support center', label: 'Support Centers' },
    { value: 'legal', label: 'Legal Services' },
    { value: 'medical', label: 'Medical Services' },
    { value: 'education', label: 'Education Services' },
    { value: 'employment', label: 'Employment Services' },
    { value: 'family', label: 'Family Services' },
    { value: 'food', label: 'Food Services' },
    { value: 'housing', label: 'Housing Services' },
  ];

  const distances = [
    { value: '1', label: '1 km' },
    { value: '2', label: '2 km' },
    { value: '5', label: '5 km' },
    { value: '10', label: '10 km' },
    { value: '25', label: '25 km' },
    { value: '50', label: '50 km' },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesDistance = resource.distance <= parseInt(selectedDistance);
    
    return matchesSearch && matchesCategory && matchesDistance;
  });

  const getCategoryBadgeColor = (category: string) => {
    switch(category) {
      case 'support center':
        return 'bg-blue-100 text-blue-800';
      case 'legal':
        return 'bg-purple-100 text-purple-800';
      case 'medical':
        return 'bg-red-100 text-red-800';
      case 'education':
        return 'bg-yellow-100 text-yellow-800';
      case 'employment':
        return 'bg-green-100 text-green-800';
      case 'family':
        return 'bg-pink-100 text-pink-800';
      case 'food':
        return 'bg-orange-100 text-orange-800';
      case 'housing':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResourceClick = (resourceId: string) => {
    setSelectedResourceId(resourceId);
    const resource = resources.find(r => r.id === resourceId);
    if (resource && mapRef.current) {
      mapRef.current.flyTo(resource.coordinates.lng, resource.coordinates.lat, 15);
    }
  };

  const handleGetDirections = (resourceId: string) => {
    const resource = resources.find(r => r.id === resourceId);
    if (resource && mapRef.current) {
      mapRef.current.flyTo(resource.coordinates.lng, resource.coordinates.lat, 16);
      
      toast({
        title: "Showing directions",
        description: `Navigating to ${resource.name}`,
      });
    }
  };

  const handleDetails = (resourceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
      setActiveResource(resource);
      setIsDetailsDialogOpen(true);
    }
  };

  const handleWebsite = (resourceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const resource = resources.find(r => r.id === resourceId);
    if (resource && resource.contactInfo?.website) {
      window.open(resource.contactInfo.website, '_blank');
      toast({
        title: `External Website`,
        description: `Opening website for ${resource.name}`,
      });
    } else {
      toast({
        title: `No Website Available`,
        description: `${resource?.name} does not have a website listed.`,
      });
    }
  };

  const handleContact = (resourceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const resource = resources.find(r => r.id === resourceId);
    if (resource) {
      setActiveResource(resource);
      setIsContactDialogOpen(true);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedDistance('5');
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Resource Map</h1>
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="sticky top-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Search & Filter</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search for resources..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
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
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Distance</label>
                    <Select value={selectedDistance} onValueChange={setSelectedDistance}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select distance" />
                      </SelectTrigger>
                      <SelectContent>
                        {distances.map((distance) => (
                          <SelectItem key={distance.value} value={distance.value}>
                            {distance.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Services</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="housing" />
                        <label htmlFor="housing" className="text-sm">Housing</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="medical" />
                        <label htmlFor="medical" className="text-sm">Medical</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="legal" />
                        <label htmlFor="legal" className="text-sm">Legal</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="food" />
                        <label htmlFor="food" className="text-sm">Food</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="education" />
                        <label htmlFor="education" className="text-sm">Education</label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" onClick={handleResetFilters}>Reset Filters</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Your Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-48 rounded-md overflow-hidden">
                    <MapComponent 
                      height="192px" 
                      zoom={12}
                      center={[13.405, 52.52]}
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-sm">
                      <span className="font-medium">Current Location:</span> Berlin, Germany
                    </p>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Update Location
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-0" style={{ minHeight: '400px' }}>
                <MapComponent 
                  ref={mapRef}
                  height="400px"
                  locations={filteredResources.map(r => ({
                    id: r.id,
                    name: r.name,
                    coordinates: r.coordinates,
                    description: r.description,
                    type: r.category
                  }))}
                  onMarkerClick={handleResourceClick}
                />
              </CardContent>
            </Card>
            
            <div className="space-y-4">
              {filteredResources.length > 0 ? (
                filteredResources.map((resource) => (
                  <Card 
                    key={resource.id} 
                    className={`transition-all duration-200 ${selectedResourceId === resource.id ? 'border-primary shadow-md' : ''}`}
                    onClick={() => handleResourceClick(resource.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <CardTitle>{resource.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {resource.address}
                            <span className="ml-1">({resource.distance} km away)</span>
                          </CardDescription>
                        </div>
                        <Badge className={getCategoryBadgeColor(resource.category)}>
                          {resource.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">{resource.description}</p>
                      <div className="mb-3">
                        <div className="text-sm font-medium">Services:</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {resource.services.map((service, index) => (
                            <Badge key={index} variant="outline">{service}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Hours:</span> {resource.openHours}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGetDirections(resource.id);
                        }}
                      >
                        <MapPin className="h-4 w-4 mr-1" /> Directions
                      </Button>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => handleDetails(resource.id, e)}
                        >
                          <FileText className="h-4 w-4 mr-1" /> Details
                        </Button>
                        <Button 
                          size="sm"
                          onClick={(e) => handleContact(resource.id, e)}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" /> Contact
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-xl font-medium mb-2">No resources found</div>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters to find resources in your area.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {activeResource?.name} Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {activeResource && (
              <>
                <div className="w-full h-[200px] rounded-md overflow-hidden mb-2">
                  <MapComponent 
                    height="200px" 
                    zoom={15} 
                    center={[activeResource.coordinates.lng, activeResource.coordinates.lat]}
                    locations={[{
                      id: activeResource.id,
                      name: activeResource.name,
                      coordinates: activeResource.coordinates,
                      description: activeResource.description,
                      type: activeResource.category
                    }]}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryBadgeColor(activeResource.category)}>
                    {activeResource.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{activeResource.address}</span>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Description</h3>
                  <p className="text-sm">{activeResource.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-1">Services</h3>
                  <div className="flex flex-wrap gap-1">
                    {activeResource.services.map((service: string, i: number) => (
                      <Badge key={i} variant="outline">{service}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-1">Opening Hours</h3>
                  <p className="text-sm">{activeResource.openHours}</p>
                </div>
                
                {activeResource.contactInfo && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Contact Information</h3>
                    
                    {activeResource.contactInfo.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{activeResource.contactInfo.phone}</span>
                      </div>
                    )}
                    
                    {activeResource.contactInfo.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{activeResource.contactInfo.email}</span>
                      </div>
                    )}
                    
                    {activeResource.contactInfo.hours && (
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{activeResource.contactInfo.hours}</span>
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
                      if (mapRef.current && activeResource) {
                        mapRef.current.flyTo(
                          activeResource.coordinates.lng,
                          activeResource.coordinates.lat, 
                          16
                        );
                        toast({
                          title: "Showing directions",
                          description: `Navigating to ${activeResource.name}`,
                        });
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Contact {activeResource?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {activeResource && (
              <>
                <div className="space-y-4 border-b pb-4">
                  <h3 className="text-sm font-medium">Direct Contact</h3>
                  
                  {activeResource.contactInfo?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{activeResource.contactInfo.phone}</span>
                    </div>
                  )}
                  
                  {activeResource.contactInfo?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{activeResource.contactInfo.email}</span>
                    </div>
                  )}
                  
                  {activeResource.contactInfo?.website && (
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={activeResource.contactInfo.website} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                  
                  {activeResource.openHours && (
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{activeResource.openHours}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4 pt-2">
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
                    <Textarea 
                      id="message" 
                      placeholder="Enter your message..." 
                      className="min-h-[120px]" 
                    />
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => {
                      setIsContactDialogOpen(false);
                      toast({
                        title: "Message sent",
                        description: `Your message to ${activeResource.name} has been sent.`,
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

export default ResourceMap;
