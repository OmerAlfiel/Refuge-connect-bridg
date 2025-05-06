import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCreateMatch } from "@/hooks/use-matches";
import { Need, Offer } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface MatchRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  need?: Need;
  offer?: Offer;
  type: "need-to-offer" | "offer-to-need";
}

export function MatchRequestDialog({
  isOpen,
  onClose,
  need,
  offer,
  type,
}: MatchRequestDialogProps) {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const createMatchMutation = useCreateMatch();

  const handleSubmit = async () => {
    if (!need || !offer) return;

    try {
      await createMatchMutation.mutateAsync({
        needId: need.id,
        offerId: offer.id,
        message,
      });

      toast({
        title: "Match requested",
        description: "Your match request has been sent successfully.",
      });

      setMessage("");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create match",
        variant: "destructive",
      });
    }
  };

  const title = type === "need-to-offer" 
    ? `Request help from ${offer?.user?.name || 'Provider'}`
    : `Offer help to ${need?.user?.name || 'Requester'}`;

  const description = type === "need-to-offer"
    ? `Send a match request to connect your need "${need?.title}" with this offer "${offer?.title}"`
    : `Send a match request to connect your offer "${offer?.title}" with this need "${need?.title}"`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Introduce yourself and explain why this is a good match..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={createMatchMutation.isPending || !message.trim()}
          >
            {createMatchMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}