import React, { useMemo } from 'react';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserMatches } from '@/hooks/use-matches';
import { useUserOffers } from '@/hooks/use-offers';
import { useNeeds } from '@/hooks/use-needs';
import { format } from 'date-fns';
import { categoriesMatch } from '@/utils/categoriesMatch';

interface VolunteerDashboardProps {
  user: User | null;
}

const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ user }) => {
  // Use the matches hook to get match data
  const { data: userMatches = [] } = useUserMatches();
  
  // Use the offers hook to get the user's active offers
  const { data: userOffers = [] } = useUserOffers();
  
  // Use the needs hook to get available needs
  const { data: allNeeds = [] } = useNeeds({ status: 'open' });
  
  // Count matches by status
  const pendingMatches = userMatches.filter(m => m.status === 'pending').length;
  const acceptedMatches = userMatches.filter(m => m.status === 'accepted').length;
  const completedMatches = userMatches.filter(m => m.status === 'completed').length;
  const rejectedMatches = userMatches.filter(m => m.status === 'rejected').length;

  // Filter active offers
  const activeOffers = useMemo(() => {
    return userOffers
      .filter(offer => offer.status === 'active')
      .map(offer => ({
        id: offer.id,
        title: offer.title,
        category: offer.category,
        createdAt: new Date(offer.createdAt),
        status: offer.status,
      }));
  }, [userOffers]);

  // Filter needs that match the user's active offers by category
  const availableNeeds = useMemo(() => {
    // Get the categories of the user's active offers
    const activeOfferCategories = activeOffers.map(offer => offer.category);
    
    // Return needs that match any of the user's offer categories
    return allNeeds
      .filter(need => activeOfferCategories.some(category => categoriesMatch(need.category, category)))
      .map(need => ({
        id: need.id,
        title: need.title,
        category: need.category,
        location: need.location ? 
          `${need.location.city || ''}${need.location.city && need.location.country ? ', ' : ''}${need.location.country || ''}` : 
          'No location',
        postedBy: need.user?.name || 'Anonymous',
        createdAt: new Date(need.createdAt),
        matchesCategory: activeOfferCategories.some(category => categoriesMatch(need.category, category)),
      }))
      .sort((a, b) => {
        // Sort by whether they directly match a category first, then by date
        if (a.matchesCategory && !b.matchesCategory) return -1;
        if (!a.matchesCategory && b.matchesCategory) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, 5);
  }, [allNeeds, activeOffers]);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingMatches}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting response</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Accepted Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{acceptedMatches}</div>
            <p className="text-xs text-muted-foreground mt-1">In progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedMatches}</div>
            <p className="text-xs text-muted-foreground mt-1">Successfully helped</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeOffers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently available</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-volunteer-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-2 bg-volunteer-100 rounded-full">
                <Plus className="h-6 w-6 text-volunteer-600" />
              </div>
              <h3 className="font-medium">Create Offer</h3>
              <p className="text-xs text-muted-foreground">Add a new service or resource you can offer</p>
              <Button className="mt-4" asChild>
                <Link to="/offers?action=create">
                  Create Now
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-2 bg-muted rounded-full">
                <MessageCircle className="h-6 w-6 text-volunteer-600" />
              </div>
              <h3 className="font-medium">Messages</h3>
              <p className="text-xs text-muted-foreground">Connect with refugees and coordinate help</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/messages">
                  View Messages
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-2 bg-muted rounded-full">
                <FileText className="h-6 w-6 text-volunteer-600" />
              </div>
              <h3 className="font-medium">Resources</h3>
              <p className="text-xs text-muted-foreground">Helpful guides on supporting refugees</p>
              <Button variant="outline" className="mt-4">
                Browse Resources
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-2 bg-muted rounded-full">
                <Clock className="h-6 w-6 text-volunteer-600" />
              </div>
              <h3 className="font-medium">Match History</h3>
              <p className="text-xs text-muted-foreground">Review your past help activities</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/matches">
                  <Clock className="h-4 w-4 mr-2" /> Match History
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="offers">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:inline-flex max-w-md">
          <TabsTrigger value="offers">My Offers</TabsTrigger>
          <TabsTrigger value="needs">Matching Needs</TabsTrigger>
          <TabsTrigger value="matches">Recent Matches</TabsTrigger>
        </TabsList>
        <TabsContent value="offers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Active Offers</h2>
            <Button asChild>
              <Link to="/offers?action=create">
                <Plus className="mr-2 h-4 w-4" /> Create New Offer
              </Link>
            </Button>
          </div>
          
          {activeOffers.length > 0 ? activeOffers.map((offer) => (
            <Card key={offer.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{offer.title}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{offer.category} • Posted {format(new Date(offer.createdAt), 'MMM d, yyyy')}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/offers/${offer.id}`}>
                      Edit
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card className="border-dashed">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <Plus className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">Create a new offer</h3>
                <p className="text-sm text-muted-foreground mb-4">Share your skills, resources or services to help refugees in need</p>
                <Button asChild>
                  <Link to="/offers?action=create">
                    <Plus className="mr-2 h-4 w-4" /> Create Offer
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="needs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Needs Matching Your Skills & Resources</h2>
          </div>
          
          {availableNeeds.length > 0 ? availableNeeds.map((need) => (
            <Card key={need.id} className={need.matchesCategory ? 'border-volunteer-300' : ''}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{need.title}</h3>
                  <p className="text-sm text-muted-foreground">Posted by: {need.postedBy}</p>
                  <p className="text-sm text-muted-foreground capitalize">{need.category} • {need.location} • Posted {format(new Date(need.createdAt), 'MMM d, yyyy')}</p>
                  {need.matchesCategory && (
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-volunteer-100 text-volunteer-800">
                        Matches your offer
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant={need.matchesCategory ? 'default' : 'outline'} asChild>
                    <Link to={`/needs/${need.id}`}>
                      <CheckCircle className="mr-2 h-4 w-4" /> Offer Help
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No matching needs found at the moment. Check back later or browse all needs.</p>
                <Button className="mt-4" variant="outline" asChild>
                  <Link to="/needs">
                    Browse All Needs
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        {/* New Matches Tab */}
        <TabsContent value="matches" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Recent Matches</h2>
            <Button variant="outline" asChild>
              <Link to="/matches">View All</Link>
            </Button>
          </div>
          
          {userMatches.length > 0 ? (
            userMatches.slice(0, 3).map((match) => (
              <Card key={match.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">
                      {match.need?.title || "Need"} + {match.offer?.title || "Offer"}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      match.status === 'completed' ? 'bg-green-100 text-green-800' :
                      match.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                      match.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Matched with: {match.need?.user?.name || match.offer?.user?.name || "Anonymous"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Created {format(new Date(match.createdAt), 'MMM d, yyyy')}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">You have no matches yet. Create an offer or respond to needs to start helping.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VolunteerDashboard;