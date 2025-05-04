import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { MapPin, FileText, Bell, Search, Settings, MessageCircle, Heart } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {isAuthenticated && (
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto">
            <nav className="flex justify-center">
              <ul className="flex items-center space-x-1 overflow-x-auto py-2">
                <li>
                  <Link to="/dashboard">
                    <Button 
                      variant={isActive('/dashboard') ? "default" : "ghost"} 
                      size="sm"
                      className={`${isActive('/dashboard') ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      Dashboard
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="/needs">
                    <Button 
                      variant={isActive('/needs') ? "default" : "ghost"}
                      size="sm" 
                      className={`flex items-center gap-1 ${isActive('/needs') ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      <Search className="h-4 w-4" />
                      <span>Needs</span>
                    </Button>
                  </Link>
                </li>
                {/* Apply the same pattern to other navigation items */}
                <li>
                  <Link to="/offers">
                    <Button 
                      variant={isActive('/offers') ? "default" : "ghost"}
                      size="sm" 
                      className={`flex items-center gap-1 ${isActive('/offers') ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      <Heart className="h-4 w-4" />
                      <span>Offers</span>
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="/map">
                    <Button 
                      variant={isActive('/map') ? "default" : "ghost"}
                      size="sm" 
                      className={`flex items-center gap-1 ${isActive('/map') ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      <MapPin className="h-4 w-4" />
                      <span>Map</span>
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="/messages">
                    <Button 
                      variant={isActive('/messages') ? "default" : "ghost"}
                      size="sm" 
                      className={`flex items-center gap-1 ${isActive('/messages') ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Messages</span>
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="/notifications">
                    <Button 
                      variant={isActive('/notifications') ? "default" : "ghost"}
                      size="sm" 
                      className={`flex items-center gap-1 ${isActive('/notifications') ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="/settings">
                    <Button 
                      variant={isActive('/settings') ? "default" : "ghost"}
                      size="sm" 
                      className={`flex items-center gap-1 ${isActive('/settings') ? 'bg-primary text-primary-foreground' : ''}`}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Button>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;