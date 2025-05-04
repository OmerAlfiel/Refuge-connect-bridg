
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { MapPin, FileText, Bell, Search, Settings, MessageCircle, Heart } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {isAuthenticated && (
        <div className="bg-muted/30 border-b">
          <div className="container flex items-center justify-between overflow-x-auto">
            <nav className="flex items-center">
              <ul className="flex items-center space-x-1">
                <li>
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm">Dashboard</Button>
                  </Link>
                </li>
                <li>
                  <Link to="/needs">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Search className="h-4 w-4" />
                      <span>Needs</span>
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="/offers">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>Offers</span>
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="/map">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Map</span>
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="/messages">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>Messages</span>
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="/notifications">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Bell className="h-4 w-4" />
                      <span>Notifications</span>
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="/announcements">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Bell className="h-4 w-4" />
                      <span>Announcements</span>
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link to="/partners">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>Partners</span>
                    </Button>
                  </Link>
                </li>
              </ul>
            </nav>
            <Link to="/settings">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
