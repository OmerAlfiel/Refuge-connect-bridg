
import React from 'react';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, Shield, AlertTriangle, CheckCircle, Users, Flag, 
  UserCheck, UserX, MessageSquare, Settings 
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface AdminDashboardProps {
  user: User | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const pendingVerifications = [
    {
      id: '1',
      name: 'John Doe',
      role: 'volunteer',
      registeredDate: new Date(2023, 4, 18),
      documents: 2,
    },
    {
      id: '2',
      name: 'Medical Relief Organization',
      role: 'ngo',
      registeredDate: new Date(2023, 4, 17),
      documents: 5,
    },
    {
      id: '3',
      name: 'Jane Smith',
      role: 'volunteer',
      registeredDate: new Date(2023, 4, 16),
      documents: 1,
    },
  ];

  const reportedContent = [
    {
      id: '1',
      type: 'message',
      content: 'Inappropriate message content',
      reportedBy: 'User123',
      date: new Date(2023, 4, 18),
      severity: 'medium',
    },
    {
      id: '2',
      type: 'offer',
      content: 'Suspicious housing offer',
      reportedBy: 'User456',
      date: new Date(2023, 4, 17),
      severity: 'high',
    },
    {
      id: '3',
      type: 'user',
      content: 'Fake volunteer profile',
      reportedBy: 'NGO789',
      date: new Date(2023, 4, 16),
      severity: 'high',
    },
  ];

  const userStats = [
    { role: 'Refugees', count: 128, growth: '+24%' },
    { role: 'Volunteers', count: 86, growth: '+12%' },
    { role: 'NGOs', count: 15, growth: '+5%' },
  ];

  const platformActivityStats = [
    { day: 'Mon', needs: 24, offers: 18 },
    { day: 'Tue', needs: 28, offers: 22 },
    { day: 'Wed', needs: 32, offers: 25 },
    { day: 'Thu', needs: 30, offers: 27 },
    { day: 'Fri', needs: 35, offers: 30 },
    { day: 'Sat', needs: 20, offers: 15 },
    { day: 'Sun', needs: 18, offers: 12 },
  ];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">229</div>
            <p className="text-xs text-muted-foreground mt-1">↑ 14% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">3 high priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reported Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7</div>
            <p className="text-xs text-muted-foreground mt-1">2 need immediate action</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">Good</div>
            <p className="text-xs text-muted-foreground mt-1">All services operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="verifications">
        <TabsList className="w-full md:w-auto grid grid-cols-2 md:inline-flex">
          <TabsTrigger value="verifications">Pending Verifications</TabsTrigger>
          <TabsTrigger value="reports">Reported Content</TabsTrigger>
          <TabsTrigger value="stats">Platform Statistics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="verifications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">User Verification Requests</h2>
            <Button variant="outline">
              <UserCheck className="mr-2 h-4 w-4" /> Verify All
            </Button>
          </div>
          
          {pendingVerifications.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    user.role === 'volunteer' ? 'bg-volunteer-100 text-volunteer-700' : 
                    user.role === 'ngo' ? 'bg-ngo-100 text-ngo-700' : 
                    'bg-muted text-muted-foreground'
                  }`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {user.role} • Registered {user.registeredDate.toLocaleDateString()} • {user.documents} document(s)
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Documents
                  </Button>
                  <Button variant="default" size="sm">
                    <UserCheck className="mr-2 h-4 w-4" /> Verify
                  </Button>
                  <Button variant="destructive" size="sm">
                    <UserX className="mr-2 h-4 w-4" /> Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Reported Content</h2>
          </div>
          
          {reportedContent.map((report) => (
            <Card key={report.id} className={`${
              report.severity === 'high' ? 'border-destructive' : 
              report.severity === 'medium' ? 'border-yellow-400' : 
              'border-muted'
            }`}>
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    report.severity === 'high' ? 'bg-destructive/10 text-destructive' : 
                    report.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-muted text-muted-foreground'
                  }`}>
                    {report.type === 'message' ? <MessageSquare className="h-5 w-5" /> : 
                     report.type === 'user' ? <Users className="h-5 w-5" /> :
                     <Flag className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-medium">{report.content}</h3>
                    <p className="text-sm text-muted-foreground">
                      Reported by: {report.reportedBy} • {report.date.toLocaleDateString()}
                    </p>
                    <div className="mt-1">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        report.severity === 'high' ? 'bg-destructive/10 text-destructive' : 
                        report.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)} Severity
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                  <Button variant="default" size="sm">
                    <Shield className="mr-2 h-4 w-4" /> Take Action
                  </Button>
                  <Button variant="ghost" size="sm">
                    Dismiss
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="stats" className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Platform Statistics</h2>
            <Button variant="outline">
              Download Report
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown of users by role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userStats.map((stat) => (
                    <div key={stat.role} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{stat.role}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{stat.count}</span>
                          <span className="text-xs text-green-600">{stat.growth}</span>
                        </div>
                      </div>
                      <Progress value={(stat.count / 230) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Needs and offers posted this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-end gap-2">
                  {platformActivityStats.map((day) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex flex-col gap-1">
                        <div 
                          className="w-full bg-refugee-400 rounded-sm" 
                          style={{ height: `${day.needs * 3}px` }}
                          title={`${day.needs} needs`}
                        ></div>
                        <div 
                          className="w-full bg-volunteer-400 rounded-sm" 
                          style={{ height: `${day.offers * 3}px` }}
                          title={`${day.offers} offers`}
                        ></div>
                      </div>
                      <span className="text-xs">{day.day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-refugee-400 rounded-sm"></div>
                    <span className="text-xs text-muted-foreground">Needs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-volunteer-400 rounded-sm"></div>
                    <span className="text-xs text-muted-foreground">Offers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current status of all platform services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Authentication Service</span>
                </div>
                <span className="text-sm text-green-500">Operational</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Database Service</span>
                </div>
                <span className="text-sm text-green-500">Operational</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Storage Service</span>
                </div>
                <span className="text-sm text-green-500">Operational</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Messaging Service</span>
                </div>
                <span className="text-sm text-green-500">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <span>Map Service</span>
                </div>
                <span className="text-sm text-yellow-500">Performance Degradation</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Platform Settings</h2>
            <Button>
              <Settings className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>User Registration Settings</CardTitle>
              <CardDescription>Control how new users can register and get verified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">Require Document Verification</h3>
                  <p className="text-sm text-muted-foreground">Users must upload ID documents before account activation</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">Disable</Button>
                  <Button>Enable</Button>
                </div>
              </div>
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">Auto-verify Volunteers</h3>
                  <p className="text-sm text-muted-foreground">Allow volunteers to start offering help without manual verification</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button>Disable</Button>
                  <Button variant="outline">Enable</Button>
                </div>
              </div>
              <div className="flex items-center justify-between pb-4">
                <div>
                  <h3 className="font-medium">Manual NGO Verification</h3>
                  <p className="text-sm text-muted-foreground">Require admin approval for NGO account activation</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">Disable</Button>
                  <Button>Enable</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Moderation</CardTitle>
              <CardDescription>Settings for content filtering and moderation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 className="font-medium">Auto-filter Sensitive Content</h3>
                  <p className="text-sm text-muted-foreground">Automatically hide posts with potentially harmful content</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">Off</Button>
                  <Button>On</Button>
                </div>
              </div>
              <div className="flex items-center justify-between pb-4">
                <div>
                  <h3 className="font-medium">User Report Threshold</h3>
                  <p className="text-sm text-muted-foreground">Number of reports before content is automatically hidden</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button>5</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Announcements</CardTitle>
              <CardDescription>Create platform-wide announcements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">
                <Bell className="mr-2 h-4 w-4" /> Create New Announcement
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
