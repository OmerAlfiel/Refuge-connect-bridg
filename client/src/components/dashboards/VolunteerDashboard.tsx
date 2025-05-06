import React from 'react';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, MessageCircle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserMatches } from '@/hooks/use-matches';

interface VolunteerDashboardProps {
  user: User | null;
}

const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ user }) => {
  // Use the matches hook to get match data
  const { data: userMatches = [] } = useUserMatches();
  
  // Count matches by status
  const pendingMatches = userMatches.filter(m => m.status === 'pending').length;
  const acceptedMatches = userMatches.filter(m => m.status === 'accepted').length;
  const completedMatches = userMatches.filter(m => m.status === 'completed').length;
  const rejectedMatches = userMatches.filter(m => m.status === 'rejected').length;

  const activeOffers = [
    {
      id: '1',
      title: 'Temporary room available',
      category: 'shelter',
      createdAt: new Date(2023, 4, 15),
      status: 'active',
    },
    {
      id: '2',
      title: 'English tutoring (online)',
      category: 'education',
      createdAt: new Date(2023, 4, 10),
      status: 'active',
    },
  ];

  const availableNeeds = [
    {
      id: '1',
      title: 'Need temporary shelter',
      category: 'shelter',
      location: 'Berlin, Germany',
      postedBy: 'Ahmed H.',
      createdAt: new Date(2023, 4, 15),
    },
    {
      id: '2',
      title: 'Legal assistance for asylum application',
      category: 'legal',
      location: 'Berlin, Germany',
      postedBy: 'Fatima K.',
      createdAt: new Date(2023, 4, 12),
    },
    {
      id: '3',
      title: 'Help with translation of documents',
      category: 'translation',
      location: 'Remote',
      postedBy: 'Youssef M.',
      createdAt: new Date(2023, 4, 5),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">Helping 1 refugee</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Needs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">3 match your skills</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-xs text-muted-foreground mt-1">All read</p>
          </CardContent>
        </Card>
        {/* New Match Statistics Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Match Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-300"></div>
                <span className="text-sm">Pending: {pendingMatches}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Accepted: {acceptedMatches}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Completed: {completedMatches}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Declined: {rejectedMatches}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/matches">
                <Clock className="h-4 w-4 mr-2" /> Match History
              </Link>
            </Button>
          </CardFooter>
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
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create New Offer
            </Button>
          </div>
          
          {activeOffers.map((offer) => (
            <Card key={offer.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{offer.title}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{offer.category} • Posted {new Date(offer.createdAt).toLocaleDateString()}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      offer.status === 'active' ? 'bg-green-100 text-green-800' :
                      offer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
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

          <Card className="border-dashed">
            <CardContent className="p-8 flex flex-col items-center justify-center text-center">
              <Plus className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">Create a new offer</h3>
              <p className="text-sm text-muted-foreground mb-4">Share your skills, resources or services to help refugees in need</p>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Offer
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="needs" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Needs Matching Your Skills & Resources</h2>
          </div>
          
          {availableNeeds.map((need) => (
            <Card key={need.id} className={need.category === 'shelter' ? 'border-volunteer-300' : ''}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{need.title}</h3>
                  <p className="text-sm text-muted-foreground">Posted by: {need.postedBy}</p>
                  <p className="text-sm text-muted-foreground capitalize">{need.category} • {need.location} • Posted {new Date(need.createdAt).toLocaleDateString()}</p>
                  {need.category === 'shelter' && (
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-volunteer-100 text-volunteer-800">
                        Matches your offer
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant={need.category === 'shelter' ? 'default' : 'outline'}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Offer Help
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      match.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      match.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      match.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      match.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">
                    {match.message && (
                      <p className="italic">"{match.message.length > 60 ? match.message.substring(0, 60) + '...' : match.message}"</p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/matches?id=${match.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No matches found</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/needs">Find Needs to Help With</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Impact Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Impact</CardTitle>
          <CardDescription>How you've helped the community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-muted rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-volunteer-600">3</p>
              <p className="text-sm text-muted-foreground">Refugees helped</p>
            </div>
            <div className="flex-1 bg-muted rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-volunteer-600">42</p>
              <p className="text-sm text-muted-foreground">Hours volunteered</p>
            </div>
            <div className="flex-1 bg-muted rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-volunteer-600">4</p>
              <p className="text-sm text-muted-foreground">Resources donated</p>
            </div>
            <div className="flex-1 bg-muted rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-volunteer-600">{completedMatches}</p>
              <p className="text-sm text-muted-foreground">Matches completed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testimonial */}
      <Card>
        <CardContent className="p-6">
          <blockquote className="border-l-4 border-muted-foreground/30 pl-4 italic">
            "Thank you for offering temporary housing when I first arrived. Your kindness made all the difference in my transition to a new country."
          </blockquote>
          <p className="text-right mt-4 font-medium">— Ahmed H., Refugee</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteerDashboard;