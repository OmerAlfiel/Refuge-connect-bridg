import { useQuery } from '@tanstack/react-query';
import { User } from '@/types';
import { useAuth } from '@/context/AuthContext';

export function useUsers() {
  const { user: currentUser, token } = useAuth();

  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      
      
      if (!token) throw new Error("Not authenticated");
      
      const response = await fetch('http://localhost:3000/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const users = await response.json();

      
      // Filter out current user and apply role-based filtering
      return users.filter((user: User) => {
        // Don't show current user
        if (user.id === currentUser?.id) {
          
          return false;
        }
        
        // If current user is refugee, they can't message other refugees
        if (currentUser?.role === 'refugee' && user.role === 'refugee') {
          
          return false;
        }
        
        return true;
      });
    },
    enabled: !!token && !!currentUser?.id,
  });
}