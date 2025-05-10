import React, { useMemo } from 'react';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, MessageCircle, MapPin, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import MapComponent from '@/components/MapComponent';
import { useUserMatches } from '@/hooks/use-matches';
import { useUserNeeds } from '@/hooks/use-needs';
import { useOffers } from '@/hooks/use-offers';
import { format } from 'date-fns';
import { categoriesMatch } from '@/utils/categoriesMatch';

interface RefugeeDashboardProps {
  user: User | null;
}

const RefugeeDashboard: React.FC<RefugeeDashboardProps> = ({ user }) => {
  // Use the matches hook to get match data
  const { data: userMatches = [] } = useUserMatches();
  
  // Use the needs hook to get user's needs
  const { data: userNeeds = [] } = useUserNeeds();
  
  // Use the offers hook to get all active offers
  const { data: allOffers = [] } = useOffers({ status: 'active' });
  
  // Count matches by status
  const pendingMatches = userMatches.filter(m => m.status === 'pending').length;
  const acceptedMatches = userMatches.filter(m => m.status === 'accepted').length;
  const completedMatches = userMatches.filter(m => m.status === 'completed').length;

  // Get recent needs
  const recentNeeds = useMemo(() => {
    return userNeeds
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map(need => ({
        id: need.id,
        title: need.title,
        category: need.category,
        status: need.status,
        createdAt: new Date(need.createdAt),
      }));
  }, [userNeeds]);

  // Find offers that match user's needs
  const matchedOffers = useMemo(() => {
    // Get categories from user's needs
    const userNeedCategories = userNeeds.map(need => need.category);
    
    // Return offers that match user's need categories
    return allOffers
      .filter(offer => userNeedCategories.some(needCategory => categoriesMatch(needCategory, offer.category)))
      .map(offer => ({
        id: offer.id,
        title: offer.title,
        category: offer.category,
        location: offer.location ? 
          `${offer.location.city || ''}${offer.location.city && offer.location.country ? ', ' : ''}${offer.location.country || ''}` : 
          'No location',
        provider: offer.user?.name || 'Anonymous',
        createdAt: new Date(offer.createdAt),
        matchesCategory: userNeedCategories.some(needCategory => categoriesMatch(needCategory, offer.category)),
      }))
      .sort((a, b) => {
        // Sort by whether they directly match a category first, then by date
        if (a.matchesCategory && !b.matchesCategory) return -1;
        if (!a.matchesCategory && b.matchesCategory) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, 5);
  }, [allOffers, userNeeds]);

  // Get nearby services - still using mocked data for now
  // Would need a geolocation-based API endpoint in the future
  const nearbyServices = [
    {
      id: '1',
      name: 'Language Support Center',
      category: 'education',
      distance: '1.2 km',
      location: { lat: 52.5200, lng: 13.4050 },
      address: 'Alexanderplatz 1, Berlin',
    },
    {
      id: '2',
      name: 'Food Distribution Point',
      category: 'food',
      distance: '0.8 km',
      location: { lat: 52.5180, lng: 13.3900 },
      address: 'Unter den Linden 10, Berlin',
    },
    {
      id: '3',
      name: 'Medical Aid Station',
      category: 'medical',
      distance: '1.5 km',
      location: { lat: 52.5260, lng: 13.4020 },
      address: 'Friedrichstraße 45, Berlin',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Your Needs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userNeeds.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {userNeeds.filter(n => n.status === 'open').length} currently open
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{acceptedMatches}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {pendingMatches} pending approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedMatches}</div>
            <p className="text-xs text-muted-foreground mt-1">Needs successfully met</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-refugee-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-2 bg-refugee-100 rounded-full">
                <Plus className="h-6 w-6 text-refugee-600" />
              </div>
              <h3 className="font-medium">Request Help</h3>
              <p className="text-xs text-muted-foreground">Create a new need and get matched with volunteers</p>
              <Button className="mt-4" asChild>
                <Link to="/needs?action=create">
                  Post a Need
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-2 bg-muted rounded-full">
                <MessageCircle className="h-6 w-6 text-refugee-600" />
              </div>
              <h3 className="font-medium">Messages</h3>
              <p className="text-xs text-muted-foreground">Connect with volunteers and service providers</p>
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
                <MapPin className="h-6 w-6 text-refugee-600" />
              </div>
              <h3 className="font-medium">Find Services</h3>
              <p className="text-xs text-muted-foreground">Locate nearby services and support centers</p>
              <Button variant="outline" className="mt-4">
                Open Map
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="needs">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:inline-flex max-w-md">
          <TabsTrigger value="needs">My Needs</TabsTrigger>
          <TabsTrigger value="offers">Available Help</TabsTrigger>
          <TabsTrigger value="services">Nearby Services</TabsTrigger>
        </TabsList>
        <TabsContent value="needs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Recent Needs</h2>
            <Button asChild>
              <Link to="/needs?action=create">
                <Plus className="mr-2 h-4 w-4" /> Post a Need
              </Link>
            </Button>
          </div>
          
          {recentNeeds.length > 0 ? recentNeeds.map((need) => (
            <Card key={need.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{need.title}</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {need.category} • Posted {format(new Date(need.createdAt), 'MMM d, yyyy')}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      need.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                      need.status === 'matched' ? 'bg-blue-100 text-blue-800' :
                      need.status === 'fulfilled' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {need.status.charAt(0).toUpperCase() + need.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/needs/${need.id}`}>
                      <FileText className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card className="border-dashed">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <Plus className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">Add your first need</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Describe what kind of help you're looking for and get matched with volunteers
                </p>
                <Button asChild>
                  <Link to="/needs?action=create">
                    <Plus className="mr-2 h-4 w-4" /> Post a Need
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="offers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Available Offers Matching Your Needs</h2>
          </div>
          
          {matchedOffers.length > 0 ? matchedOffers.map((offer) => (
            <Card key={offer.id} className={offer.matchesCategory ? 'border-refugee-300' : ''}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{offer.title}</h3>
                  <p className="text-sm text-muted-foreground">Provider: {offer.provider}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {offer.category} • {offer.location} • Posted {format(new Date(offer.createdAt), 'MMM d, yyyy')}
                  </p>
                  {offer.matchesCategory && (
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-refugee-100 text-refugee-800">
                        Matches your need
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant={offer.matchesCategory ? 'default' : 'outline'} asChild>
                    <Link to={`/offers/${offer.id}`}>
                      Request Help
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No matching offers found at the moment. Post a need to get matched with available help.</p>
                <Button className="mt-4" variant="outline" asChild>
                  <Link to="/offers">
                    Browse All Offers
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="services" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Services Near You</h2>
          </div>

          {/* Map - still using mocked services */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video h-[300px]">
                <MapComponent 
                  height="300px" 
                  center={[13.404954, 52.520008]} 
                  zoom={12} 
                  locations={nearbyServices.map(service => ({
                    id: service.id,
                    name: service.name,
                    coordinates: {
                      lat: service.location.lat,
                      lng: service.location.lng
                    },
                    description: service.address,
                    type: service.category
                  }))}
                />
              </div>
            </CardContent>
          </Card>
          
          {nearbyServices.map((service) => (
            <Card key={service.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {service.category} • {service.distance} away
                  </p>
                  <p className="text-sm text-muted-foreground">{service.address}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RefugeeDashboard;