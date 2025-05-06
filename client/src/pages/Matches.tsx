import React, { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Info, AlertCircle, Loader2, Filter } from "lucide-react";
import Layout from "@/components/Layout";
import { MatchCard } from "@/components/MatchCard";
import { useUserMatches } from "@/hooks/use-matches";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { MatchStatus } from "@/types";

const Matches: React.FC = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("all"); // all, need, offer
  
  const { data: userMatches = [], isLoading, isError } = useUserMatches();
  
  // Filter matches based on status, type, and search term
  const filteredMatches = useMemo(() => {
    return userMatches.filter((match) => {
      // Filter by status
      const matchesStatus = status === "all" || match.status === status;
      
      // Filter by type (need-only, offer-only, or full matches)
      const matchesType = 
        type === "all" || 
        (type === "need" && match.needId && !match.offerId) || 
        (type === "offer" && !match.needId && match.offerId) ||
        (type === "full" && match.needId && match.offerId);
      
      // Filter by search term
      const matchesSearch = search === "" || 
        (match.need?.title?.toLowerCase().includes(search.toLowerCase())) || 
        (match.offer?.title?.toLowerCase().includes(search.toLowerCase())) ||
        (match.message?.toLowerCase().includes(search.toLowerCase()));
      
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [userMatches, status, type, search]);
  
  // Separate matches by role
  const sentMatches = filteredMatches.filter(match => match.initiatedBy === user?.id);
  const receivedMatches = filteredMatches.filter(match => match.initiatedBy !== user?.id);

  // Get counts of each status for UI badges
  const pendingCount = userMatches.filter(m => m.status === 'pending').length;
  const acceptedCount = userMatches.filter(m => m.status === 'accepted').length;
  const completedCount = userMatches.filter(m => m.status === 'completed').length;
  const rejectedCount = userMatches.filter(m => m.status === 'rejected').length;

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: `Pending (${pendingCount})` },
    { value: "accepted", label: `Accepted (${acceptedCount})` },
    { value: "completed", label: `Completed (${completedCount})` },
    { value: "rejected", label: `Rejected (${rejectedCount})` },
  ];

  const typeOptions = [
    { value: "all", label: "All Types" },
    { value: "full", label: "Complete Matches" },
    { value: "need", label: "Need Requests" },
    { value: "offer", label: "Offer Requests" },
  ];

  const clearFilters = () => {
    setStatus("all");
    setSearch("");
    setType("all");
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Your Matches</h1>
        <p className="text-muted-foreground mb-6">
          View and manage connections between needs and offers
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search matches..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Match Type" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {(status !== "all" || search !== "" || type !== "all") && (
            <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="bg-destructive/10 p-4 rounded-md flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p>There was an error loading your matches. Please try again later.</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Info className="h-10 w-10 text-muted-foreground mx-auto" />
            <h3 className="text-xl font-medium">No matches found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {search || status !== "all" || type !== "all"
                ? "Try adjusting your search filters."
                : "When you create matches between needs and offers, they'll appear here."}
            </p>
          </div>
        ) : (
          <Tabs defaultValue="all" className="mt-6">
            <TabsList className="mb-8">
              <TabsTrigger value="all" className="relative">
                All Matches
                <Badge className="ml-2 bg-primary text-primary-foreground">
                  {filteredMatches.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="received" className="relative">
                Received
                {receivedMatches.length > 0 && (
                  <Badge className="ml-2 bg-primary text-primary-foreground">
                    {receivedMatches.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="sent" className="relative">
                Sent
                {sentMatches.length > 0 && (
                  <Badge className="ml-2 bg-primary text-primary-foreground">
                    {sentMatches.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredMatches.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No matches found with the current filters.
                </p>
              ) : (
                filteredMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))
              )}
            </TabsContent>

            <TabsContent value="received" className="space-y-4">
              {receivedMatches.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No received match requests with the current filters.
                </p>
              ) : (
                receivedMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))
              )}
            </TabsContent>

            <TabsContent value="sent" className="space-y-4">
              {sentMatches.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No sent match requests with the current filters.
                </p>
              ) : (
                sentMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default Matches;