import React from 'react';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, MessageCircle, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import MapComponent from '@/components/MapComponent';

interface RefugeeDashboardProps {
  user: User | null;
}

const RefugeeDashboard: React.FC<RefugeeDashboardProps> = ({ user }) => {
  const recentNeeds = [
    {
      id: '1',
      title: 'Need temporary shelter',
      category: 'shelter',
      status: 'open',
      createdAt: new Date(2023, 4, 15),
    },
    {
      id: '2',
      title: 'Help with translation of documents',
      category: 'translation',
      status: 'matched',
      createdAt: new Date(2023, 4, 10),
    },
    {
      id: '3',
      title: 'Legal assistance for asylum application',
      category: 'legal',
      status: 'open',
      createdAt: new Date(2023, 4, 5),
    },
  ];

  const matchedOffers = [
    {
      id: '1',
      title: 'Temporary room available',
      category: 'shelter',
      provider: 'Sarah Miller',
      createdAt: new Date(2023, 4, 16),
    },
    {
      id: '2',
      title: 'Free legal consultation',
      category: 'legal',
      provider: 'Legal Aid Society',
      createdAt: new Date(2023, 4, 12),
    },
  ];

  // Nearby services locations for the map
  const nearbyServices = [
    {
      id: '1',
      name: 'Local Community Center',
      type: 'support',
      coordinates: { lat: 52.52, lng: 13.405 },
      description: 'General support and information for refugees'
    },
    {
      id: '2',
      name: 'Medical Clinic',
      type: 'medical',
      coordinates: { lat: 52.51, lng: 13.41 },
      description: 'Free healthcare services'
    },
    {
      id: '3',
      name: 'Legal Aid Office',
      type: 'legal',
      coordinates: { lat: 52.525, lng: 13.415 },
      description: 'Free legal consultation'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Posted Needs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">2 open, 1 matched</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Matched Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">Ready to connect</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">From 2 conversations</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="needs">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:inline-flex max-w-md">
          <TabsTrigger value="needs">My Needs</TabsTrigger>
          <TabsTrigger value="offers">Matched Offers</TabsTrigger>
        </TabsList>
        <TabsContent value="needs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Posted Needs</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Post New Need
            </Button>
          </div>
          
          {recentNeeds.map((need) => (
            <Card key={need.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{need.title}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{need.category} • Posted {new Date(need.createdAt).toLocaleDateString()}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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
                  <Button variant="ghost" size="icon">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="offers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Available Offers Matching Your Needs</h2>
          </div>
          
          {matchedOffers.map((offer) => (
            <Card key={offer.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{offer.title}</h3>
                  <p className="text-sm text-muted-foreground">Offered by: {offer.provider}</p>
                  <p className="text-sm text-muted-foreground capitalize">{offer.category} • Posted {new Date(offer.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button>Contact Provider</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Map Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Nearby Services</span>
            <Link to="/map">
              <Button variant="outline" size="sm">
                <MapPin className="mr-2 h-4 w-4" /> View Full Map
              </Button>
            </Link>
          </CardTitle>
          <CardDescription>Services and resources available in your area</CardDescription>
        </CardHeader>
        <CardContent>
          <MapComponent 
            height="240px"
            locations={nearbyServices}
            zoom={13}
            center={[13.405, 52.52]}
          />
        </CardContent>
      </Card>

      {/* Announcements Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
          <CardDescription>Important updates and information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <h3 className="font-semibold">Free Medical Camp</h3>
            <p className="text-sm text-muted-foreground">Medical services available at Central Community Center on May 15, 2023. Bring your ID documents.</p>
            <p className="text-xs text-muted-foreground mt-1">Posted by: Medical Aid International • 2 days ago</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h3 className="font-semibold">Language Classes Registration</h3>
            <p className="text-sm text-muted-foreground">Free language classes registration starting next week. English, German and French available.</p>
            <p className="text-xs text-muted-foreground mt-1">Posted by: Education Support Network • 5 days ago</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RefugeeDashboard;
