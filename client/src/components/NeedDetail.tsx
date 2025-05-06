// Import the necessary components at the top of the file
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useOffers } from "@/hooks/use-offers";
import { useCreateMatch } from "@/hooks/use-matches";
import { Need } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, UserIcon, CheckCircle, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { categoriesMatch } from "@/utils/categoriesMatch";

// Update the interface
interface NeedDetailProps {
  need: Need;
  isOpen: boolean;
  onClose: () => void;
  onOfferHelp: (needId: string, message: string) => Promise<void>;
}

export function NeedDetail({ need, isOpen, onClose, onOfferHelp }: NeedDetailProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMatchOffers, setShowMatchOffers] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const createMatchMutation = useCreateMatch();
  
  // Fetch user's offers that can be matched with this need
  const { data: userOffers = [], isLoading: isLoadingOffers } = useOffers({ 
    status: 'active'
  });

  // Filter offers that match the need's category
  const matchingOffers = userOffers.filter(offer => categoriesMatch(need.category, offer.category));

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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'matched': return 'bg-blue-100 text-blue-800';
      case 'fulfilled': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOfferHelp = async () => {
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onOfferHelp(need.id, message);
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Failed to submit offer", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateMatch = async (offerId: string) => {
    try {
      await createMatchMutation.mutateAsync({
        needId: need.id,
        offerId,
        message: `Matching offer to need: ${need.title}`
      });
      
      toast({
        title: "Match requested",
        description: "Your match request has been sent successfully.",
      });
      
      setShowMatchOffers(false);
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
            {need.title}
            {need.urgent && (
              <Badge variant="destructive" className="ml-2">Urgent</Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className={getCategoryBadgeColor(need.category)}>
              {need.category}
            </Badge>
            <Badge className={getStatusBadgeColor(need.status)}>
              {need.status.charAt(0).toUpperCase() + need.status.slice(1)}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <UserIcon className="h-3 w-3" />
            Posted by: {need.user?.name || 'Anonymous'}
          </p>
          
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {need.location?.address || 'No location specified'}
          </p>
          
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Posted on: {format(new Date(need.createdAt), 'PP')}
          </p>
          
          <div className="bg-muted p-4 rounded-md">
            <p>{need.description}</p>
          </div>
          
          {user && need.status === 'open' && user.id !== need.userId && (
            <div className="pt-4 space-y-4">
              <div className="flex justify-between">
                <h4 className="font-medium flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Offer Help
                </h4>
                
                {user.role === 'volunteer' || user.role === 'ngo' ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowMatchOffers(true)}
                    disabled={matchingOffers.length === 0}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Match with My Offers
                  </Button>
                ) : null}
              </div>
              
              {showMatchOffers ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Select an offer to match with this need:
                  </p>
                  
                  {isLoadingOffers ? (
                    <div className="flex justify-center p-4">
                      <div className="spinner"></div>
                    </div>
                  ) : matchingOffers.length === 0 ? (
                    <p className="text-sm">
                      No matching offers found. You need to create an offer in the same category first.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {matchingOffers.map(offer => (
                        <div 
                          key={offer.id} 
                          className="flex justify-between items-center border p-3 rounded-md"
                        >
                          <div>
                            <p className="font-medium">{offer.title}</p>
                            <p className="text-xs text-muted-foreground">{offer.category}</p>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleCreateMatch(offer.id)}
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
                      onClick={() => setShowMatchOffers(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Textarea
                    placeholder="Describe how you can help with this need..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleOfferHelp} disabled={isSubmitting || !message.trim()}>
                      {isSubmitting ? "Sending..." : "Send Offer"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}