
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">About Our Platform</h1>
        
        <Tabs defaultValue="mission">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="mission">Our Mission</TabsTrigger>
            <TabsTrigger value="team">Our Team</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mission" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
                <CardDescription>
                  Connecting refugees with resources and support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our platform was founded with a clear mission: to bridge the gap between refugees and the resources they need. 
                  We believe in the power of community and technology to transform lives during difficult transitions.
                </p>
                <p>
                  By connecting refugees with local volunteers, organizations, and services, we aim to create a supportive ecosystem
                  that empowers individuals to rebuild their lives with dignity and hope.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-muted/50 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                    <div className="text-sm">Refugees Supported</div>
                  </div>
                  <div className="bg-muted/50 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary mb-2">500+</div>
                    <div className="text-sm">Partner Organizations</div>
                  </div>
                  <div className="bg-muted/50 p-6 rounded-lg text-center">
                    <div className="text-3xl font-bold text-primary mb-2">50+</div>
                    <div className="text-sm">Countries Reached</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mt-8">Our Core Values</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Human dignity at the center of all we do</li>
                  <li>Accessibility for all, regardless of background</li>
                  <li>Community-driven solutions and support</li>
                  <li>Transparency in operations and decision-making</li>
                  <li>Innovation in addressing complex challenges</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Our Team</CardTitle>
                <CardDescription>
                  The dedicated individuals behind our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4"></div>
                    <h3 className="font-medium">Sarah Johnson</h3>
                    <p className="text-sm text-muted-foreground">Founder & Executive Director</p>
                    <p className="text-sm mt-2">Former refugee advocate with 15 years of experience in humanitarian work.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4"></div>
                    <h3 className="font-medium">Michael Chen</h3>
                    <p className="text-sm text-muted-foreground">Chief Technology Officer</p>
                    <p className="text-sm mt-2">Tech innovator focused on creating accessible digital solutions for humanitarian needs.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4"></div>
                    <h3 className="font-medium">Aisha Nkosi</h3>
                    <p className="text-sm text-muted-foreground">Director of Partnerships</p>
                    <p className="text-sm mt-2">Expert in building cross-sector collaborations for social impact.</p>
                  </div>
                </div>
                
                <div className="mt-12">
                  <h3 className="text-xl font-semibold mb-4">Our Board of Advisors</h3>
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-muted rounded-full flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium">Dr. Emma Rivera</h4>
                        <p className="text-sm text-muted-foreground">Migration Policy Expert</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-muted rounded-full flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium">Hassan Al-Farsi</h4>
                        <p className="text-sm text-muted-foreground">Former UN Refugee Coordinator</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-muted rounded-full flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium">Sofia Bergström</h4>
                        <p className="text-sm text-muted-foreground">Tech Entrepreneur</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-muted rounded-full flex-shrink-0"></div>
                      <div>
                        <h4 className="font-medium">James Okonkwo</h4>
                        <p className="text-sm text-muted-foreground">Community Organizer</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="faq" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Answers to common questions about our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I sign up as a refugee seeking help?</AccordionTrigger>
                    <AccordionContent>
                      To register as a refugee, click the "Register" button at the top of the page and select "Refugee" as your account type. You'll need to provide basic information, and our team will verify your account within 24 hours to ensure your privacy and safety.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How can I volunteer my time or resources?</AccordionTrigger>
                    <AccordionContent>
                      To volunteer, register an account and select "Volunteer" as your account type. You can specify your skills, availability, and the types of support you can offer. Once verified, you'll be matched with refugees or organizations needing your specific assistance.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>Is my personal information secure?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we take data security very seriously. All personal information is encrypted and stored securely. We never share your data with third parties without explicit consent, and we have strict privacy policies in place to protect all users, especially vulnerable populations.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>How are resources vetted before being listed?</AccordionTrigger>
                    <AccordionContent>
                      All resources, services, and organizations on our platform go through a thorough verification process. Our team checks credentials, verifies the legitimacy of services offered, and regularly monitors for quality. We also encourage user feedback to maintain high standards.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>Can I use this platform in different languages?</AccordionTrigger>
                    <AccordionContent>
                      Yes, our platform currently supports multiple languages including English, Arabic, Farsi, Ukrainian, French, and Spanish. We're continuously working to add more languages to make our services accessible to as many people as possible.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-6">
                    <AccordionTrigger>How can organizations partner with your platform?</AccordionTrigger>
                    <AccordionContent>
                      Organizations can register for an NGO account and submit partnership proposals through the dashboard. Our partnerships team reviews all applications and will contact you to discuss collaboration opportunities, API access, resource sharing, and other integration possibilities.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>
                  We're here to help - reach out with any questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Send us a message</h3>
                    <div className="space-y-3">
                      <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium">Your Name</label>
                        <Input id="name" placeholder="Enter your name" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                        <Input id="email" type="email" placeholder="Enter your email" />
                      </div>
                      <div className="grid gap-2">
                        <label htmlFor="message" className="text-sm font-medium">Message</label>
                        <textarea 
                          id="message" 
                          rows={5} 
                          placeholder="Enter your message"
                          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        ></textarea>
                      </div>
                      <Button className="w-full">Send Message</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium">Other ways to reach us</h3>
                    <div>
                      <h4 className="font-medium mb-1">Email</h4>
                      <p className="text-sm text-primary">support@refugeehelp.org</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Phone</h4>
                      <p className="text-sm">+1 (555) 123-4567 (International)</p>
                      <p className="text-sm">0800 123 4567 (Toll-free)</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Address</h4>
                      <address className="text-sm not-italic">
                        123 Humanitarian Way<br />
                        Berlin, Germany 10115
                      </address>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Hours</h4>
                      <p className="text-sm">Support available 24/7</p>
                      <p className="text-sm">Office hours: Mon-Fri, 9am-5pm CET</p>
                    </div>
                    <div className="mt-8">
                      <div className="flex gap-3">
                        <Button variant="outline" size="icon">
                          <span className="sr-only">Twitter</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                          </svg>
                        </Button>
                        <Button variant="outline" size="icon">
                          <span className="sr-only">Facebook</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                          </svg>
                        </Button>
                        <Button variant="outline" size="icon">
                          <span className="sr-only">Instagram</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default About;
