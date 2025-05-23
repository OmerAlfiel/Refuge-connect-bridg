import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, LogOut, User, MessageCircle, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUnreadCount } from '@/hooks/use-message';
import { useUnreadNotificationCount } from '@/hooks/use-notification';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const { data: unreadCount = 0, isLoading: isLoadingUnread } = useUnreadCount();
  const { data: unreadNotificationCount = 0 } = useUnreadNotificationCount();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold">R</span>
            </div>
            <span className="font-bold text-xl hidden md:inline-block">RefugeLink</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium ${isActive('/') ? 'text-primary font-bold' : 'hover:text-primary'}`}
          >
            Home
          </Link>
          <Link 
            to="/needs" 
            className={`text-sm font-medium ${isActive('/needs') ? 'text-primary font-bold' : 'hover:text-primary'}`}
          >
            Needs
          </Link>
          <Link 
            to="/offers" 
            className={`text-sm font-medium ${isActive('/offers') ? 'text-primary font-bold' : 'hover:text-primary'}`}
          >
            Offers
          </Link>
          <Link 
            to="/map" 
            className={`text-sm font-medium ${isActive('/map') ? 'text-primary font-bold' : 'hover:text-primary'}`}
          >
            Map
          </Link>
          <Link 
            to="/about" 
            className={`text-sm font-medium ${isActive('/about') ? 'text-primary font-bold' : 'hover:text-primary'}`}
          >
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold flex items-center justify-center text-primary-foreground">
                      {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Link to="/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <MessageCircle className="h-5 w-5" />
                  {!isLoadingUnread && unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">{unreadCount}</span>
                  )}
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className={
                        user?.role === 'refugee' ? 'bg-refugee-500 text-white' :
                        user?.role === 'volunteer' ? 'bg-volunteer-500 text-white' :
                        user?.role === 'ngo' ? 'bg-ngo-500 text-white' :
                        'bg-primary text-primary-foreground'
                      }>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/messages" className="cursor-pointer">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                      {!isLoadingUnread && unreadCount > 0 && (
                        <Badge variant="outline" className="ml-auto h-4 min-w-4 flex items-center justify-center text-[10px]">{unreadCount}</Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/notifications" className="cursor-pointer">
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                      {unreadNotificationCount > 0 && (
                        <Badge variant="outline" className="ml-auto h-4 min-w-4 flex items-center justify-center text-[10px]">
                          {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 bg-background border-t">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className={`text-sm font-medium ${isActive('/') ? 'text-primary font-bold' : 'hover:text-primary'}`}
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link 
              to="/needs" 
              className={`text-sm font-medium ${isActive('/needs') ? 'text-primary font-bold' : 'hover:text-primary'}`}
              onClick={toggleMobileMenu}
            >
              Needs
            </Link>
            <Link 
              to="/offers" 
              className={`text-sm font-medium ${isActive('/offers') ? 'text-primary font-bold' : 'hover:text-primary'}`}
              onClick={toggleMobileMenu}
            >
              Offers
            </Link>
            <Link 
              to="/map" 
              className={`text-sm font-medium ${isActive('/map') ? 'text-primary font-bold' : 'hover:text-primary'}`}
              onClick={toggleMobileMenu}
            >
              Map
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium ${isActive('/about') ? 'text-primary font-bold' : 'hover:text-primary'}`}
              onClick={toggleMobileMenu}
            >
              About
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium hover:text-primary" onClick={toggleMobileMenu}>
                  Dashboard
                </Link>
                <Link to="/messages" className="text-sm font-medium hover:text-primary flex items-center justify-between" onClick={toggleMobileMenu}>
                  <span>Messages</span>
                  {!isLoadingUnread && unreadCount > 0 && (
                    <Badge variant="outline" className="text-xs">{unreadCount}</Badge>
                  )}
                </Link>
                <Link to="/notifications" className="text-sm font-medium hover:text-primary flex items-center justify-between" onClick={toggleMobileMenu}>
                  <span>Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                    </Badge>
                  )}
                </Link>
                <Link to="/settings" className="text-sm font-medium hover:text-primary" onClick={toggleMobileMenu}>
                  Settings
                </Link>
                <button 
                  className="text-sm font-medium text-destructive hover:text-destructive/80 text-left"
                  onClick={() => {
                    logout();
                    toggleMobileMenu();
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Link 
                  to="/login" 
                  className="w-full"
                  onClick={toggleMobileMenu}
                >
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link 
                  to="/register" 
                  className="w-full"
                  onClick={toggleMobileMenu}
                >
                  <Button className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
