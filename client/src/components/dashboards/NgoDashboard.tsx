
import React from 'react';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, MessageCircle, Bell, Users, Calendar, CheckCircle, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";

interface NgoDashboardProps {
  user: User | null;
}

const NgoDashboard: React.FC<NgoDashboardProps> = ({ user }) => {
  const needsByCategory = [
    { category: 'Shelter', count: 18 },
    { category: 'Food', count: 12 },
    { category: 'Medical', count: 9 },
    { category: 'Legal', count: 15 },
    { category: 'Education', count: 7 },
    { category: 'Translation', count: 5 },
  ];

  const recentMatches = [
    {
      id: '1',
      need: 'Temporary shelter needed',
      offer: 'Room available for 2 weeks',
      refugee: 'Ahmed H.',
      volunteer: 'Sarah M.',
      date: new Date(2023, 4, 18),
    },
    {
      id: '2',
      need: 'Legal assistance with asylum',
      offer: 'Pro bono legal consultation',
      refugee: 'Fatima K.',
      volunteer: 'Legal Aid Society',
      date: new Date(2023, 4, 17),
    },
    {
      id: '3',
      need: 'Food support for family of 4',
      offer: 'Weekly food packages',
      refugee: 'Mohammed A.',
      volunteer: 'Food Bank Initiative',
      date: new Date(2023, 4, 16),
    },
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: 'Free Medical Camp',
      date: new Date(2023, 4, 25),
      location: 'Community Center',
      attendees: 12,
    },
    {
      id: '2',
      title: 'Language Workshop',
      date: new Date(2023, 5, 3),
      location: 'Public Library',
      attendees: 24,
    },
    {
      id: '3',
      title: 'Job Fair for Refugees',
      date: new Date(2023, 5, 10),
      location: 'Convention Center',
      attendees: 45,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Needs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">54</div>
            <p className="text-xs text-muted-foreground mt-1">↑ 18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">37</div>
            <p className="text-xs text-muted-foreground mt-1">↑ 5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Refugees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">128</div>
            <p className="text-xs text-muted-foreground mt-1">24 new this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">72%</div>
            <p className="text-xs text-muted-foreground mt-1">↑ 8% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Needs Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Needs by Category</span>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
            </CardTitle>
            <CardDescription>Distribution of current refugee needs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {needsByCategory.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className="text-sm text-muted-foreground">{item.count}</span>
                </div>
                <Progress value={(item.count / 20) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View Detailed Report
            </Button>
          </CardFooter>
        </Card>

        {/* Recent Matches */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Matches</CardTitle>
            <CardDescription>Successfully connected needs with offers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentMatches.map((match) => (
              <div key={match.id} className="flex items-start gap-4 p-3 rounded-lg border">
                <div className="h-8 w-8 rounded-full bg-ngo-100 text-ngo-700 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">{match.need}</div>
                  <div className="text-sm text-muted-foreground">
                    <span className="text-ngo-600">{match.refugee}</span> + <span className="text-volunteer-600">{match.volunteer}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Matched on {match.date.toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Matches
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Upcoming Events</span>
            <Button>
              <Calendar className="mr-2 h-4 w-4" /> Create Event
            </Button>
          </CardTitle>
          <CardDescription>Events organized by your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-3 min-w-[60px]">
                  <span className="text-sm font-bold">{event.date.getDate()}</span>
                  <span className="text-xs text-muted-foreground">{event.date.toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{event.title}</div>
                  <div className="text-sm text-muted-foreground">{event.location}</div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {event.attendees}
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Announcements</span>
            <Button>
              <Bell className="mr-2 h-4 w-4" /> Create Announcement
            </Button>
          </CardTitle>
          <CardDescription>Broadcast important information to refugees and volunteers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-ngo-500 pl-4 py-2">
              <h3 className="font-semibold">Free Medical Camp</h3>
              <p className="text-sm text-muted-foreground">Medical services available at Central Community Center on May 15, 2023. Bring your ID documents.</p>
              <div className="flex justify-between mt-2">
                <p className="text-xs text-muted-foreground">Posted 2 days ago</p>
                <div className="space-x-2">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                </div>
              </div>
            </div>
            <div className="border-l-4 border-ngo-500 pl-4 py-2">
              <h3 className="font-semibold">Language Classes Registration</h3>
              <p className="text-sm text-muted-foreground">Free language classes registration starting next week. English, German and French available.</p>
              <div className="flex justify-between mt-2">
                <p className="text-xs text-muted-foreground">Posted 5 days ago</p>
                <div className="space-x-2">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NgoDashboard;
