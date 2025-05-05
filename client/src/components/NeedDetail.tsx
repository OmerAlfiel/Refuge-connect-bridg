import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User as UserIcon, MessageSquare } from 'lucide-react';
import { Need } from "@/types";
import { useAuth } from "@/context/AuthContext";

interface NeedDetailProps {
  need: Need;
  isOpen: boolean;
  onClose: () => void;
  onOfferHelp: (needId: string, message: string) => void;
}

export const NeedDetail: React.FC<NeedDetailProps> = ({ need, isOpen, onClose, onOfferHelp }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCategoryBadgeColor = (category: string) => {
    switch(category) {
      case 'shelter': return 'bg-blue-100 text-blue-800';
      case 'food': return 'bg-green-100 text-green-800';
      case 'medical': return 'bg-red-100 text-red-800';
      case 'legal': return 'bg-purple-100 text-purple-800';
      case 'education': return 'bg-yellow-100 text-yellow-800';
      case 'translation': return 'bg-indigo-100 text-indigo-800';
      case 'clothing': return 'bg-pink-100 text-pink-800';
      case 'employment': return 'bg-orange-100 text-orange-800';
      case 'transportation': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
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
            Posted on: {new Date(need.createdAt).toLocaleDateString()}
          </p>
          
          <div className="bg-muted p-4 rounded-md">
            <p>{need.description}</p>
          </div>
          
          {user && need.status === 'open' && user.id !== need.userId && (
            <div className="pt-4 space-y-4">
              <h4 className="font-medium flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                Offer Help
              </h4>
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
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};