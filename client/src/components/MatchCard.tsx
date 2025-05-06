import { useState } from "react";
import { format } from "date-fns";
import { Check, Clock, X, MessageCircle, MoreHorizontal, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Match } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { useUpdateMatchStatus } from "@/hooks/use-matches";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const [isRespondDialogOpen, setIsRespondDialogOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState<"accept" | "reject" | null>(null);
  const { user } = useAuth();
  const updateMatchStatus = useUpdateMatchStatus();
  const { toast } = useToast();

  const isUserInitiator = user?.id === match.initiatedBy;
  const canRespond = !isUserInitiator && match.status === "pending";
  const formatDate = (dateString: string | Date) => {
    return format(new Date(dateString), "PPP");
  };

  // Determine if this is a direct request (only need or only offer)
  const isDirectRequest = !match.needId || !match.offerId;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch(category?.toLowerCase()) {
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

  const handleOpenResponse = (type: "accept" | "reject") => {
    setResponseType(type);
    setIsRespondDialogOpen(true);
  };

  const handleSubmitResponse = async () => {
    if (!responseType) return;

    try {
      await updateMatchStatus.mutateAsync({
        id: match.id,
        data: {
          status: responseType === "accept" ? "accepted" : "rejected",
          message: responseMessage,
        },
      });

      toast({
        title: responseType === "accept" ? "Match accepted" : "Match declined",
        description: responseType === "accept"
          ? "You have accepted this match request."
          : "You have declined this match request.",
      });

      setIsRespondDialogOpen(false);
      setResponseMessage("");
      setResponseType(null);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to respond to match",
        variant: "destructive",
      });
    }
  };

  const handleMarkCompleted = async () => {
    try {
      await updateMatchStatus.mutateAsync({
        id: match.id,
        data: {
          status: "completed",
        },
      });

      toast({
        title: "Match completed",
        description: "This match has been marked as completed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to mark match as completed",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center">
                {isDirectRequest ? (
                  // This is a direct request (either need or offer is null)
                  <>
                    {match.needId ? (
                      <>
                        <Badge variant="outline" className="mr-2">Need Request</Badge>
                        {match.need?.title || "Need"}
                      </>
                    ) : (
                      <>
                        <Badge variant="outline" className="mr-2">Offer Request</Badge>
                        {match.offer?.title || "Offer"}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <span className="truncate max-w-[120px] md:max-w-xs">{match.need?.title || "Need"}</span>
                    <ChevronRight className="mx-1 h-4 w-4 text-muted-foreground" />
                    <span className="truncate max-w-[120px] md:max-w-xs">{match.offer?.title || "Offer"}</span>
                  </>
                )}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                {formatDate(match.createdAt)}
                
                {match.need && (
                  <Badge className={`ml-2 ${getCategoryBadgeColor(match.need.category)}`} variant="secondary">
                    {match.need.category}
                  </Badge>
                )}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(match.status)}>
              {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-2">
          <div className="space-y-2">
            {match.needId && (
              <div>
                <p className="text-sm font-medium">Need:</p>
                <p className="text-sm">{match.need?.description?.substring(0, 100) || "No description available"}
                  {match.need?.description && match.need.description.length > 100 ? "..." : ""}
                </p>
                {match.need?.urgent && (
                  <Badge variant="destructive" className="mt-1">Urgent</Badge>
                )}
              </div>
            )}
            
            {match.offerId && (
              <div>
                <p className="text-sm font-medium">Offer:</p>
                <p className="text-sm">{match.offer?.description?.substring(0, 100) || "No description available"}
                  {match.offer?.description && match.offer.description.length > 100 ? "..." : ""}
                </p>
              </div>
            )}
            
            {match.message && (
              <div>
                <p className="text-sm font-medium">Initial message:</p>
                <p className="text-sm bg-muted p-2 rounded-md">{match.message}</p>
              </div>
            )}
            
            <div className="text-sm text-muted-foreground pt-2">
              {isUserInitiator ? "You requested this match" : "Match requested by another user"}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-2">
          <div>
            {match.status === "accepted" && (
              <Button
                variant="ghost"
                size="sm"
                className="flex gap-1 items-center"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Message</span>
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {canRespond && match.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenResponse("reject")}
                  className="text-red-600"
                >
                  <X className="h-4 w-4 mr-1" />
                  Decline
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleOpenResponse("accept")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Accept
                </Button>
              </>
            )}
            
            {match.status === "accepted" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleMarkCompleted}>
                    Mark as Completed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isRespondDialogOpen} onOpenChange={setIsRespondDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {responseType === "accept" ? "Accept" : "Decline"} Match Request
            </DialogTitle>
            <DialogDescription>
              {responseType === "accept"
                ? "You're accepting to connect this need with this offer."
                : "You're declining to connect this need with this offer."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="response" className="text-sm font-medium">
                Message (optional)
              </label>
              <Textarea
                id="response"
                placeholder={
                  responseType === "accept"
                    ? "Add any details about next steps..."
                    : "Let them know why this isn't a good match..."
                }
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRespondDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitResponse}
              disabled={updateMatchStatus.isPending}
              variant={responseType === "accept" ? "default" : "destructive"}
            >
              {updateMatchStatus.isPending && (
                <span className="spinner h-4 w-4 mr-2" />
              )}
              {responseType === "accept" ? "Accept Request" : "Decline Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}