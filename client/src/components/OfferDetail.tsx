import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNeeds } from "@/hooks/use-needs";
import { useCreateMatch } from "@/hooks/use-matches";
import { Offer } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, UserIcon, CheckCircle, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import MapComponent from "@/components/MapComponent";

// Interface matching the NeedDetail props pattern
interface OfferDetailProps {
  offer: Offer;
  isOpen: boolean;
  onClose: () => void;
  onRequestMatch: (offerId: string, message: string) => Promise<void>;
}

export function OfferDetail({ offer, isOpen, onClose, onRequestMatch }: OfferDetailProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMatchNeeds, setShowMatchNeeds] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const createMatchMutation = useCreateMatch();
  
  // Fetch user's needs that can be matched with this offer
  const { data: userNeeds = [], isLoading: isLoadingNeeds } = useNeeds({ 
    status: 'open',
  });

  // Filter needs that match the offer's category
  const matchingNeeds = userNeeds.filter(need => {
    // Direct category match
    if (need.category === offer.category) {
      return true;
    }
    
    // Special case for shelter/housing equivalence
    if ((need.category === 'shelter' && offer.category === 'housing') || 
        (need.category === 'housing' && offer.category === 'shelter')) {
      return true;
    }
    
    return false;
  });

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
  
  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRequestMatch = async () => {
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onRequestMatch(offer.id, message);
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Failed to request match", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCreateMatch = async (needId: string) => {
    try {
      await createMatchMutation.mutateAsync({
        needId,
        offerId: offer.id,
        message: `Matching need to offer: ${offer.title}`
      });
      
      toast({
        title: "Match requested",
        description: "Your match request has been sent successfully.",
      });
      
      setShowMatchNeeds(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create match",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {offer.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className={getCategoryBadgeColor(offer.category)}>
              {offer.category}
            </Badge>
            <Badge className={getStatusBadgeColor(offer.status)}>
              {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <UserIcon className="h-3 w-3" />
            Posted by: {offer.user?.name || 'Anonymous'}
          </p>
          
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {offer.location?.city}, {offer.location?.country}
          </p>
          
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Posted on: {format(new Date(offer.createdAt), 'PP')}
          </p>
          
          <div className="bg-muted p-4 rounded-md">
            <p>{offer.description}</p>
          </div>
          
          {offer.location?.lat && offer.location?.lng && (
            <div className="w-full h-[200px] rounded-md overflow-hidden">
              <MapComponent 
                height="200px" 
                center={[offer.location.lng, offer.location.lat]}
                zoom={12}
                locations={[{
                  id: offer.id,
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
          
          {user && offer.status === 'active' && user.id !== offer.userId && user.role === 'refugee' && (
            <div className="pt-4 space-y-4">
              <div className="flex justify-between">
                <h4 className="font-medium flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Request Help
                </h4>
                
                {user.role === 'refugee' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowMatchNeeds(true)}
                    disabled={matchingNeeds.length === 0}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Match with My Needs
                  </Button>
                )}
              </div>
              
              {showMatchNeeds ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Select a need to match with this offer:
                  </p>
                  
                  {isLoadingNeeds ? (
                    <div className="flex justify-center p-4">
                      <div className="spinner"></div>
                    </div>
                  ) : matchingNeeds.length === 0 ? (
                    <p className="text-sm">
                      No matching needs found. You need to create a need in the same category first.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {matchingNeeds.map(need => (
                        <div 
                          key={need.id} 
                          className="flex justify-between items-center border p-3 rounded-md"
                        >
                          <div>
                            <p className="font-medium">{need.title}</p>
                            <p className="text-xs text-muted-foreground">{need.category}</p>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleCreateMatch(need.id)}
                          >
                            Match
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowMatchNeeds(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Textarea
                    placeholder="Describe why you need this offer..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleRequestMatch} disabled={isSubmitting || !message.trim()}>
                      {isSubmitting ? "Sending..." : "Request Match"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Contact details section for all users */}
          {offer.contact && (
            <div className="border-t pt-4 mt-4">
              <h4 className="font-medium mb-2">Contact Information</h4>
              
              {offer.contact.phone && (
                <p className="text-sm mb-1">
                  <span className="font-medium">Phone:</span> {offer.contact.phone}
                </p>
              )}
              
              {offer.contact.email && (
                <p className="text-sm mb-1">
                  <span className="font-medium">Email:</span> {offer.contact.email}
                </p>
              )}
              
              {offer.contact.website && (
                <p className="text-sm">
                  <span className="font-medium">Website:</span>{" "}
                  <a 
                    href={offer.contact.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {offer.contact.website}
                  </a>
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}