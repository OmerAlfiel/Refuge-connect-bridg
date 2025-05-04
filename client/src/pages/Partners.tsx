
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Globe, Heart, FileText, Users, MapPin } from 'lucide-react';

const Partners: React.FC = () => {
  // Sample partner organizations
  const partners = [
    {
      name: 'Global Aid Initiative',
      logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=150&h=150&q=80',
      description: 'Providing emergency relief and long-term support to displaced communities worldwide.',
      category: 'International NGO',
      services: ['Shelter', 'Medical', 'Food'],
    },
    {
      name: 'Legal Aid Society',
      logo: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=150&h=150&q=80',
      description: 'Pro bono legal assistance for asylum applications and immigration procedures.',
      category: 'Legal Services',
      services: ['Legal', 'Documentation'],
    },
    {
      name: 'Education Without Borders',
      logo: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=150&h=150&q=80',
      description: 'Ensuring access to quality education for refugee children and adults.',
      category: 'Education',
      services: ['Education', 'Translation'],
    },
    {
      name: 'Shelter Network',
      logo: 'https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=150&h=150&q=80',
      description: 'Connecting refugees with temporary and long-term housing solutions.',
      category: 'Housing',
      services: ['Shelter', 'Transportation'],
    },
    {
      name: 'Medical Aid International',
      logo: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?auto=format&fit=crop&w=150&h=150&q=80',
      description: 'Healthcare services and medical supplies for vulnerable populations.',
      category: 'Healthcare',
      services: ['Medical', 'Counseling'],
    },
    {
      name: 'Integration Support Network',
      logo: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?auto=format&fit=crop&w=150&h=150&q=80',
      description: 'Helping refugees integrate into new communities through language and cultural programs.',
      category: 'Integration',
      services: ['Translation', 'Employment', 'Education'],
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-ngo-50 to-background py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-ngo-100 px-3 py-1 text-sm text-ngo-800 mb-4">
                Our Partner Network
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                Working Together for Positive Change
              </h1>
              <p className="text-muted-foreground md:text-xl">
                Our mission is made possible by partnerships with trusted organizations committed to supporting refugees and displaced communities.
              </p>
            </div>
            <div className="mx-auto lg:ml-auto">
              <div className="bg-white p-2 rounded-2xl shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Partnering for Impact" 
                  className="rounded-xl aspect-video object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Our Partner Organizations</h2>
            <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
              These trusted organizations work with RefugeLink to provide critical services and support to refugees around the world.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner, index) => (
              <Card key={index} className="transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-lg">{partner.name}</CardTitle>
                    <CardDescription>{partner.category}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {partner.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {partner.services.map((service, i) => (
                      <span key={i} className="bg-secondary/20 text-secondary-foreground px-2.5 py-0.5 rounded-full text-xs font-medium">
                        {service}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Partnership Benefits</h2>
            <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
              Working with RefugeLink allows your organization to expand its reach and make a greater impact.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 rounded-full bg-ngo-100 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-ngo-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Extended Reach</h3>
              <p className="text-muted-foreground">Connect with refugees who need your services across multiple regions and languages.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 rounded-full bg-ngo-100 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-ngo-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Network Collaboration</h3>
              <p className="text-muted-foreground">Collaborate with other organizations to provide comprehensive support to refugees.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 rounded-full bg-ngo-100 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-ngo-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Resource Sharing</h3>
              <p className="text-muted-foreground">Share information, resources, and best practices with other organizations in the network.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 rounded-full bg-ngo-100 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-ngo-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Service Visibility</h3>
              <p className="text-muted-foreground">Make your services visible on our interactive map and service directory.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 rounded-full bg-ngo-100 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-ngo-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct Impact</h3>
              <p className="text-muted-foreground">Connect directly with individuals in need to provide timely and relevant assistance.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 rounded-full bg-ngo-100 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-ngo-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Status</h3>
              <p className="text-muted-foreground">Gain trust through our verification process, helping refugees feel secure using your services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Partner CTA */}
      <section className="py-16 bg-gradient-to-b from-background to-ngo-50">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter mb-4">Become a Partner</h2>
            <p className="text-muted-foreground mb-8">
              Join our network of organizations committed to supporting refugees and making a difference in their lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="bg-ngo-600 hover:bg-ngo-700">
                Apply to Partner
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Partners;
