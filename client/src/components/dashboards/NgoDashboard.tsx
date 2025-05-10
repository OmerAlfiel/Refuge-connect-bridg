import React, { useMemo } from 'react';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, MessageCircle, Bell, Users, Calendar, CheckCircle, Filter, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";
import { useUserMatches } from '@/hooks/use-matches';
import { useNeeds } from '@/hooks/use-needs';
import { format } from 'date-fns';

interface NgoDashboardProps {
  user: User | null;
}

const NgoDashboard: React.FC<NgoDashboardProps> = ({ user }) => {
  // Use the matches hook to get match data
  const { data: userMatches = [] } = useUserMatches();
  
  // Use the needs hook to get needs data
  const { data: allNeeds = [] } = useNeeds();
  
  // Calculate match metrics
  const totalMatches = userMatches.length;
  const pendingMatchesCount = userMatches.filter(m => m.status === 'pending').length;
  const acceptedMatchesCount = userMatches.filter(m => m.status === 'accepted').length;
  const completedMatchesCount = userMatches.filter(m => m.status === 'completed').length;
  const rejectedMatchesCount = userMatches.filter(m => m.status === 'rejected').length;
  
  // Calculate success rate
  const successRate = totalMatches > 0 
    ? Math.round((acceptedMatchesCount + completedMatchesCount) / totalMatches * 100) 
    : 0;

  // Calculate real needs by category
  const needsByCategory = useMemo(() => {
    const categoryCount = new Map<string, number>();
    
    allNeeds.forEach(need => {
      const category = need.category.charAt(0).toUpperCase() + need.category.slice(1);
      categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
    });
    
    return Array.from(categoryCount.entries())
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [allNeeds]);

  // Get recent matches
  const recentMatches = useMemo(() => {
    return userMatches
      .filter(match => match.status === 'accepted' || match.status === 'completed')
      .sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, 3)
      .map(match => ({
        id: match.id,
        need: match.need?.title || 'Unknown Need',
        offer: match.offer?.title || 'Unknown Offer',
        refugee: match.need?.user?.name || 'Anonymous Refugee',
        volunteer: match.offer?.user?.name || 'Anonymous Volunteer',
        date: new Date(match.createdAt),
      }));
  }, [userMatches]);

  // Note: Upcoming events would need a new API/hook if available
  // For now, we'll keep the mocked events until that API is available
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
            <div className="text-3xl font-bold">{allNeeds.filter(n => n.status === 'open').length}</div>
            <p className="text-xs text-muted-foreground mt-1">Updated just now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userMatches.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Updated just now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Refugees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{
              // Count unique refugee users
              new Set(allNeeds.map(need => need.userId)).size
            }</div>
            <p className="text-xs text-muted-foreground mt-1">Based on needs posted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">From {totalMatches} total matches</p>
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
                <Progress 
                  value={(item.count / (Math.max(...needsByCategory.map(i => i.count)) || 1)) * 100} 
                  className="h-2" 
                />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/needs">
                View All Needs
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Match Statistics Card - NEW */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Match Statistics</span>
              <Button variant="outline" size="sm" asChild>
                <Link to="/matches">
                  <PieChart className="h-4 w-4 mr-2" /> Full View
                </Link>
              </Button>
            </CardTitle>
            <CardDescription>Analysis of match outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-ngo-600">{totalMatches}</p>
                  <p className="text-sm text-muted-foreground">Total Matches</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{successRate}%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                      <span className="text-sm font-medium">Pending</span>
                    </div>
                    <span className="text-sm">{pendingMatchesCount}</span>
                  </div>
                  <Progress value={(pendingMatchesCount / (totalMatches || 1)) * 100} className="h-2 bg-yellow-100" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm font-medium">Accepted</span>
                    </div>
                    <span className="text-sm">{acceptedMatchesCount}</span>
                  </div>
                  <Progress value={(acceptedMatchesCount / (totalMatches || 1)) * 100} className="h-2 bg-green-100" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                    <span className="text-sm">{completedMatchesCount}</span>
                  </div>
                  <Progress value={(completedMatchesCount / (totalMatches || 1)) * 100} className="h-2 bg-blue-100" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span className="text-sm font-medium">Declined</span>
                    </div>
                    <span className="text-sm">{rejectedMatchesCount}</span>
                  </div>
                  <Progress value={(rejectedMatchesCount / (totalMatches || 1)) * 100} className="h-2 bg-red-100" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Matches */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Matches</CardTitle>
          <CardDescription>Successfully connected needs with offers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentMatches.length > 0 ? (
            recentMatches.map((match) => (
              <div key={match.id} className="flex items-start gap-4 p-3 rounded-lg border">
                <div className="bg-primary/10 p-2 rounded-full text-primary">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Match: {match.id.substring(0, 8)}</h4>
                    <span className="text-xs text-muted-foreground">{format(new Date(match.date), 'MMM d, yyyy')}</span>
                  </div>
                  <p className="text-sm">Need: {match.need}</p>
                  <p className="text-sm">Offer: {match.offer}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">Refugee: {match.refugee}</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">Helper: {match.volunteer}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No recent matches to display
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" asChild>
            <Link to="/matches">View All Matches</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Upcoming Events - keeping mocked data for now until we have events API */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Community events and workshops</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg border">
              <div className="bg-ngo-100 text-ngo-800 p-2 rounded-full">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{event.title}</h4>
                  <span className="text-xs text-muted-foreground">{format(new Date(event.date), 'MMM d, yyyy')}</span>
                </div>
                <p className="text-sm text-muted-foreground">{event.location}</p>
                <div className="mt-1">
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">{event.attendees} attendees</span>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Create Event
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NgoDashboard;