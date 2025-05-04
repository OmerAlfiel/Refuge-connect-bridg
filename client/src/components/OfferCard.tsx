import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, MessageCircle, ExternalLink, Mail, Phone, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MapComponent, { MapComponentRef } from '@/components/MapComponent';
import { useNavigate } from 'react-router-dom';

const OfferCard = ({ offer }: { offer: any }) => {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const { toast } = useToast();
  const mapRef = useRef<MapComponentRef>(null);
  const navigate = useNavigate();

  const handleViewOnMap = () => {
    // Store the location data in localStorage
    localStorage.setItem('selectedLocation', JSON.stringify({
      id: 'offer-location',
      name: offer.title,
      coordinates: offer.coordinates,
      description: offer.description,
      type: offer.type
    }));
    
    // Navigate to the correct route
    navigate('/resources');
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative h-48">
          {offer.imageUrl ? (
            <img
              src={offer.imageUrl}
              alt={offer.title}
              className="absolute object-cover w-full h-full"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <CardTitle className="text-lg font-semibold">{offer.title}</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {offer.organization}
            </CardDescription>
          </div>
          <Badge>{offer.type}</Badge>
        </div>
        
        <div className="mb-3">
          <div className="text-sm font-medium">Description:</div>
          <p className="text-sm text-gray-700">{offer.description}</p>
        </div>
        
        <div className="mb-3">
          <div className="text-sm font-medium">Location:</div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-gray-500" />
            <span className="text-sm text-gray-700">{offer.location}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsContactDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <MessageCircle className="h-3 w-3" /> Contact
            </Button>
            
            <Button
              size="sm"
              onClick={() => setIsLocationDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <MapPin className="h-3 w-3" /> View Location
            </Button>
          </div>
          
          <Button size="sm">Apply Now</Button>
        </div>
      </CardContent>

      {/* Contact Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Contact Information</DialogTitle>
            <CardDescription>{offer.contact?.name}</CardDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <Button variant="outline" asChild>
                <a href={`mailto:${offer.contact?.email}`} className="w-full text-left">
                  {offer.contact?.email}
                </a>
              </Button>
            </div>
            <div className="grid gap-2">
              <label htmlFor="phone">Phone</label>
              <Button variant="outline" asChild>
                <a href={`tel:${offer.contact?.phone}`} className="w-full text-left">
                  {offer.contact?.phone}
                </a>
              </Button>
            </div>
            <div className="grid gap-2">
              <label htmlFor="website">Website</label>
              <Button variant="outline" asChild>
                <a href={offer.contact?.website} target="_blank" rel="noopener noreferrer" className="w-full text-left">
                  {offer.contact?.website}
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Location Dialog */}
      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Location</DialogTitle>
            <CardDescription>{offer.location}</CardDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="w-full h-[200px] rounded-md overflow-hidden">
              <MapComponent 
                ref={mapRef}
                height="200px" 
                center={[offer.coordinates?.lng || 13.405, offer.coordinates?.lat || 52.52]}
                zoom={12}
                locations={[{
                  id: 'offer-location',
                  name: offer.title,
                  coordinates: offer.coordinates,
                  description: offer.description,
                  type: offer.type
                }]}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleViewOnMap}>
              <MapPin className="mr-2 h-4 w-4" />
              See on Full Map
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default OfferCard;
