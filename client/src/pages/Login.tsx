import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Add effect to redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User is authenticated, redirecting to dashboard...");
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        login(data); // Pass the { user, access_token } object
        toast({
          title: t("login.success"),
          description: t("login.welcomeBack", { name: data.user.name }),
        });
        
        // Remove the explicit navigation here - let the useEffect handle it
        // This ensures the auth context is fully updated before navigation
      } else {
        toast({
          title: t("login.failed"),
          description: data.message || t("login.invalidCredentials"),
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t("login.failed"),
        description: t("login.errorOccurred"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemo = (role: UserRole) => {
    const user = getSampleUserByRole(role);
    
    if (user) {
      // Simulate the server response format
      login({
        user,
        access_token: "demo-token-for-" + role
      });
      
      toast({
        title: t("demo.activated"),
        description: t("demo.welcomeAs", { role: t(`roles.${role}`) }),
      });
      
      // Remove this direct navigation too - let the useEffect handle it
    } else {
      toast({
        title: t("demo.failed"),
        description: t("demo.roleMissing"),
        variant: "destructive",
      });
    }
}

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/40">
      <div className="absolute top-4 right-4">
      </div>
      
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{t("login.title")}</CardTitle>
            <CardDescription className="text-center">
              {t("login.enterCredentials")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  placeholder={t("common.email")}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="password"
                  placeholder={t("common.password")}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? t("common.loading") : t("login.login")}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t("demo.orUseDemo")}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline"
                onClick={() => handleDemo("refugee")}
              >
                {t("demo.loginAs")} {t("roles.refugee")}
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleDemo("volunteer")}
              >
                {t("demo.loginAs")} {t("roles.volunteer")}
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleDemo("ngo")}
              >
                {t("demo.loginAs")} {t("roles.ngo")}
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleDemo("admin")}
              >
                {t("demo.loginAs")} {t("roles.admin")}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" asChild>
              <Link to="/register">{t("login.dontHaveAccount")}</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function getSampleUserByRole(role: UserRole) {
  // Demo users for each role
  switch (role) {
    case "refugee":
      return {
        id: "refugee-demo-id",
        name: "Refugee Demo User",
        email: "refugee@demo.com",
        role: role,
        profileCompleted: true,
        createdAt: new Date().toISOString(),
        language: "en",
        verified: true,
      };
    case "volunteer":
      return {
        id: "volunteer-demo-id",
        name: "Volunteer Demo User",
        email: "volunteer@demo.com",
        role: role,
        profileCompleted: true,
        skills: ["language", "transportation", "housing"],
        createdAt: new Date().toISOString(),
        language: "en",
        verified: true,
      };
    case "ngo":
      return {
        id: "ngo-demo-id",
        name: "NGO Demo Organization",
        email: "ngo@demo.com",
        role: role,
        organizationName: "Demo NGO",
        profileCompleted: true,
        createdAt: new Date().toISOString(),
        language: "en",
        verified: true,
      };
    case "admin":
      return {
        id: "admin-demo-id",
        name: "Admin Demo User",
        email: "admin@demo.com",
        role: role,
        profileCompleted: true,
        createdAt: new Date().toISOString(),
        language: "en",
        verified: true,
      };
    default:
      return null;
  }
}
