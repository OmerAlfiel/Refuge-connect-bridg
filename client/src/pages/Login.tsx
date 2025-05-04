
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { useAuth, getSampleUserByRole } from '@/context/AuthContext';
import { UserRole } from '@/types';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  

  const handleDemo = (role: UserRole) => {
    const user = getSampleUserByRole(role);
    
    if (user) {
      login(user);
      toast({
        title: "Logged in successfully",
        description: `You're now logged in as ${user.name} (${role}).`,
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login failed",
        description: "Demo user not found. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Log in</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="yourname@example.com" />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="password" type="password" />
                </div>
                <Button className="w-full">Log in</Button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with demo accounts
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => handleDemo('refugee')} className="border-refugee-300 hover:bg-refugee-50">
                  Refugee Demo
                </Button>
                <Button variant="outline" onClick={() => handleDemo('volunteer')} className="border-volunteer-300 hover:bg-volunteer-50">
                  Volunteer Demo
                </Button>
                <Button variant="outline" onClick={() => handleDemo('ngo')} className="border-ngo-300 hover:bg-ngo-50">
                  NGO Demo
                </Button>
                <Button variant="outline" onClick={() => handleDemo('admin')}>
                  Admin Demo
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Register
                </Link>
              </div>
              <div className="text-center text-xs text-muted-foreground mt-2">
                By logging in, you agree to our{' '}
                <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
                  Privacy Policy
                </Link>
                .
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
