
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { Globe, Heart, ShieldCheck, Home, MessageCircle, FileText, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-refugee-50 to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-refugee-100 px-3 py-1 text-sm text-refugee-800 mb-4">
                A Humanitarian Platform
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter animate-fade-up">
                Connecting Refugees with Essential Support & Services
              </h1>
              <p className="text-muted-foreground md:text-xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
                RefugeLink bridges the gap between refugees and the support they need. Find assistance or offer your help to those in need.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg">Go to Dashboard</Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg">Get Started</Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline" size="lg">Log In</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="mx-auto lg:ml-auto">
              <div className="bg-white p-2 rounded-2xl shadow-lg animate-fade-up" style={{ animationDelay: '0.3s' }}>
                <img 
                  src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=2000"
                  alt="Volunteers helping refugees" 
                  className="rounded-xl aspect-video object-cover w-full h-64"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter">How RefugeLink Works</h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Our platform connects those in need with those who can help
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="transition-all hover:border-refugee-300 hover:shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-refugee-100 text-refugee-700">
                  <Home className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Find Shelter & Resources</h3>
                <p className="text-muted-foreground">
                  Refugees can post their needs from shelter to legal help, and quickly get matched with available resources.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="transition-all hover:border-volunteer-300 hover:shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-volunteer-100 text-volunteer-700">
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Offer Your Support</h3>
                <p className="text-muted-foreground">
                  Volunteers and donors can list available resources, services, or items they wish to provide to those in need.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="transition-all hover:border-ngo-300 hover:shadow-md">
              <CardContent className="pt-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-ngo-100 text-ngo-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Verified Organizations</h3>
                <p className="text-muted-foreground">
                  NGOs and official organizations coordinate aid efforts, manage resources, and ensure safety for all users.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=2000"
                alt="Group of diverse people working together to help refugees" 
                className="mx-auto rounded-xl shadow-lg object-cover w-full h-64"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">Key Platform Benefits</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-refugee-100 text-refugee-700">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Multilingual Support</h3>
                    <p className="text-muted-foreground">Full Arabic/English UI enables communication across language barriers.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-refugee-100 text-refugee-700">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Location Services</h3>
                    <p className="text-muted-foreground">Interactive maps show nearby resources, services, and aid locations.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-refugee-100 text-refugee-700">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Secure Communication</h3>
                    <p className="text-muted-foreground">Private messaging system connects refugees with verified helpers.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-refugee-100 text-refugee-700">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Document Storage</h3>
                    <p className="text-muted-foreground">Securely upload and store important documents and identification.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-b from-background to-refugee-50">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Join RefugeLink Today</h2>
            <p className="text-muted-foreground mb-8">
              Whether you need assistance or want to offer help, RefugeLink connects you with the right people and resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register?role=refugee">
                <Button variant="default" size="lg" className="bg-refugee-600 hover:bg-refugee-700">
                  I Need Help
                </Button>
              </Link>
              <Link to="/register?role=volunteer">
                <Button variant="outline" size="lg" className="border-volunteer-600 text-volunteer-600 hover:bg-volunteer-50">
                  I Want to Help
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
