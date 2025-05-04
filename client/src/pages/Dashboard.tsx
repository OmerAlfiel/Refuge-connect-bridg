
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@/types';

// Role-specific dashboard components
import RefugeeDashboard from '@/components/dashboards/RefugeeDashboard';
import VolunteerDashboard from '@/components/dashboards/VolunteerDashboard';
import NgoDashboard from '@/components/dashboards/NgoDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-16rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const renderDashboardByRole = (role: UserRole) => {
    switch (role) {
      case 'refugee':
        return <RefugeeDashboard user={user} />;
      case 'volunteer':
        return <VolunteerDashboard user={user} />;
      case 'ngo':
        return <NgoDashboard user={user} />;
      case 'admin':
        return <AdminDashboard user={user} />;
      default:
        return <div>Unknown role</div>;
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h1>
        {renderDashboardByRole(user?.role as UserRole)}
      </div>
    </Layout>
  );
};

export default Dashboard;
