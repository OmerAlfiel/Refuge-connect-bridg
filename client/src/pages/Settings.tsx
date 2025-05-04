import React, { useState, useRef } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Bell, Globe, Lock, Mail, Save, User } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Create refs for each section
  const profileSectionRef = useRef<HTMLDivElement>(null);
  const notificationsSectionRef = useRef<HTMLDivElement>(null);
  const securitySectionRef = useRef<HTMLDivElement>(null);
  const languageSectionRef = useRef<HTMLDivElement>(null);

  // Basic information state
  const [name, setName] = useState(user?.name || '');
  // If user.email doesn't exist, fallback to an empty string
  const [email, setEmail] = useState(user?.email as string || '');
  const [language, setLanguage] = useState('en');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [newOfferNotifications, setNewOfferNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  
  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState('all');
  const [shareLocation, setShareLocation] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Function to scroll to a section
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSaveSettings = () => {
    // In a real app, this would send the data to an API
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };

  const handleDeleteAccount = () => {
    // In a real app, this would show a confirmation dialog and handle deletion
    toast({
      title: "Account action",
      description: "This functionality would delete your account after confirmation.",
      variant: "destructive",
    });
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar navigation for larger screens */}
          <div className="col-span-12 lg:col-span-3 space-y-2 lg:sticky lg:top-24 lg:self-start">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              size="lg"
              onClick={() => scrollToSection(profileSectionRef)}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              size="lg"
              onClick={() => scrollToSection(notificationsSectionRef)}
            >
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              size="lg"
              onClick={() => scrollToSection(securitySectionRef)}
            >
              <Lock className="mr-2 h-4 w-4" />
              Privacy & Security
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              size="lg"
              onClick={() => scrollToSection(languageSectionRef)}
            >
              <Globe className="mr-2 h-4 w-4" />
              Language & Region
            </Button>
          </div>
          
          {/* Main content area */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* Profile Section */}
            <Card ref={profileSectionRef} id="profile-section">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your personal details and how they appear to others
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Your full name" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com" 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </Button>
              </CardFooter>
            </Card>
            
            {/* Notifications Section */}
            <Card ref={notificationsSectionRef} id="notifications-section">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control how you receive notifications and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via SMS
                    </p>
                  </div>
                  <Switch 
                    id="sms-notifications" 
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="offer-notifications">New Offers & Matches</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone offers to help with your needs or matches your offers
                    </p>
                  </div>
                  <Switch 
                    id="offer-notifications" 
                    checked={newOfferNotifications}
                    onCheckedChange={setNewOfferNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="message-notifications">Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you receive new messages
                    </p>
                  </div>
                  <Switch 
                    id="message-notifications" 
                    checked={messageNotifications}
                    onCheckedChange={setMessageNotifications}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Save Notification Settings</Button>
              </CardFooter>
            </Card>
            
            {/* Privacy & Security */}
            <Card ref={securitySectionRef} id="security-section">
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>
                  Manage your privacy settings and account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Everyone</SelectItem>
                      <SelectItem value="verified">Verified Users Only</SelectItem>
                      <SelectItem value="organizations">Organizations Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Control who can see your profile information
                  </p>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="location-sharing">Share Location</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow the app to use your location for better matching
                    </p>
                  </div>
                  <Switch 
                    id="location-sharing" 
                    checked={shareLocation}
                    onCheckedChange={setShareLocation}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch 
                    id="two-factor" 
                    checked={twoFactorAuth}
                    onCheckedChange={setTwoFactorAuth}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Save Security Settings</Button>
              </CardFooter>
            </Card>
            
            {/* Language Settings */}
            <Card ref={languageSectionRef} id="language-section">
              <CardHeader>
                <CardTitle>Language & Region</CardTitle>
                <CardDescription>
                  Configure your language and regional settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية (Arabic)</SelectItem>
                      <SelectItem value="fr">Français (French)</SelectItem>
                      <SelectItem value="de">Deutsch (German)</SelectItem>
                      <SelectItem value="es">Español (Spanish)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Save Language Settings</Button>
              </CardFooter>
            </Card>
            
            {/* Danger Zone */}
            <Card className="border-red-200">
              <CardHeader className="bg-red-50 dark:bg-red-950/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <CardTitle className="text-red-500">Danger Zone</CardTitle>
                </div>
                <CardDescription>
                  Actions here cannot be undone. Please proceed with caution.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, all of your data, posts, and history will be permanently removed. 
                  This action cannot be undone.
                </p>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
