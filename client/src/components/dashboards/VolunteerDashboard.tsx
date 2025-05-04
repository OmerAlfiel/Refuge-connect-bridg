
import React from 'react';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, MessageCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VolunteerDashboardProps {
  user: User | null;
}

const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ user }) => {
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
      <div className="grid gap-4 md:grid-cols-3">
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
      </div>

      {/* Main Content */}
      <Tabs defaultValue="offers">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:inline-flex max-w-md">
          <TabsTrigger value="offers">My Offers</TabsTrigger>
          <TabsTrigger value="needs">Matching Needs</TabsTrigger>
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
