import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, MessageCircle, CalendarIcon, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MapComponent, { MapComponentRef } from '@/components/MapComponent';
import { useNavigate } from 'react-router-dom';
import { Offer } from '@/types';
import { format } from 'date-fns';

interface OfferCardProps {
  offer: Offer;
  onContact?: (offerId: string) => void;
}

const OfferCard = ({ offer, onContact }: OfferCardProps) => {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const { toast } = useToast();
  const mapRef = useRef<MapComponentRef>(null);
  const navigate = useNavigate();

  const handleContact = () => {
    if (onContact) {
      onContact(offer.id);
    } else {
      setIsContactDialogOpen(true);
    }
  };

  const handleViewOnMap = () => {
    localStorage.setItem('selectedLocation', JSON.stringify({
      id: offer.id,
      name: offer.title,
      coordinates: offer.location,
      description: offer.description,
      type: offer.category
    }));
    navigate('/resources');
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };

  const getCategoryBadgeColor = (category: string) => {
    switch(category) {
      case 'shelter': return 'bg-blue-100 text-blue-800';
      case 'food': return 'bg-green-100 text-green-800';
      case 'medical': return 'bg-red-100 text-red-800';
      case 'legal': return 'bg-purple-100 text-purple-800';
      case 'education': return 'bg-yellow-100 text-yellow-800';
      case 'translation': return 'bg-indigo-100 text-indigo-800';
      case 'employment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{offer.title}</CardTitle>
          <Badge className={getCategoryBadgeColor(offer.category)}>
            {offer.category}
          </Badge>
        </div>
        <CardDescription className="flex flex-col gap-1 mt-1">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{offer.user?.name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{offer.location?.city}, {offer.location?.country}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            <span>Posted {formatDate(offer.createdAt)}</span>
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm line-clamp-2">{offer.description}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleContact}
          >
            <MessageCircle className="h-3 w-3 mr-1" /> Contact
          </Button>
          
          {offer.location?.lat && offer.location?.lng && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsLocationDialogOpen(true)}
            >
              <MapPin className="h-3 w-3 mr-1" /> Location
            </Button>
          )}
        </div>
        
        <Button size="sm">Apply</Button>
      </CardFooter>

      {/* Contact Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Contact Information</DialogTitle>
            <CardDescription>{offer.contact?.name || offer.user?.name}</CardDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {offer.contact?.email && (
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Button variant="outline" asChild>
                  <a href={`mailto:${offer.contact.email}`} className="w-full text-left text-sm">
                    {offer.contact.email}
                  </a>
                </Button>
              </div>
            )}
            
            {offer.contact?.phone && (
              <div className="grid gap-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                <Button variant="outline" asChild>
                  <a href={`tel:${offer.contact.phone}`} className="w-full text-left text-sm">
                    {offer.contact.phone}
                  </a>
                </Button>
              </div>
            )}
            
            {offer.contact?.website && (
              <div className="grid gap-2">
                <label htmlFor="website" className="text-sm font-medium">Website</label>
                <Button variant="outline" asChild>
                  <a href={offer.contact.website} target="_blank" rel="noopener noreferrer" className="w-full text-left text-sm">
                    {offer.contact.website}
                  </a>
                </Button>
              </div>
            )}
            
            {!offer.contact?.email && !offer.contact?.phone && !offer.contact?.website && (
              <p className="text-center text-muted-foreground">No contact information provided.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Location Dialog */}
      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Location</DialogTitle>
            <CardDescription>{offer.location?.address || `${offer.location?.city}, ${offer.location?.country}`}</CardDescription>
          </DialogHeader>
          
          {offer.location?.lat && offer.location?.lng && (
            <div className="w-full h-[200px] rounded-md overflow-hidden">
              <MapComponent 
                ref={mapRef}
                height="200px" 
                center={[offer.location.lng, offer.location.lat]}
                zoom={12}
                locations={[{
                  id: 'offer-location',
                  name: offer.title,
                  coordinates: {
                    lat: offer.location.lat,
                    lng: offer.location.lng
                  },
                  description: offer.description,
                  type: offer.category
                }]}
              />
            </div>
          )}
          
          <div className="flex justify-end mt-4">
            <Button onClick={handleViewOnMap}>
              <MapPin className="mr-2 h-4 w-4" />
              View on Full Map
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default OfferCard;