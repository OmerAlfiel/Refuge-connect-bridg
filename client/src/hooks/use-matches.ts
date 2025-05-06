import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MatchesApi } from '../api/matchesApi';
import { useAuth } from '../context/AuthContext';
import { CreateMatchRequest, MatchStatus, UpdateMatchRequest, MatchesQueryParams } from '../types';
import { useToast } from './use-toast';
import { apiBaseUrl } from '@/api/api';

export function useMatches(needId?: string, offerId?: string, status?: MatchStatus) {
  const { token } = useAuth();
  const queryParams: MatchesQueryParams = { needId, offerId, status };
  
  return useQuery({
    queryKey: ['matches', queryParams],
    queryFn: () => MatchesApi.getMatches(queryParams, token),
    enabled: !!token && (!!needId || !!offerId || !!status),
    retry: 1,
    refetchOnWindowFocus: false
  });
}

export function useUserMatches() {
  const { token, user } = useAuth();
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ['user-matches'],
    queryFn: async () => {
      if (!token || !user?.id) {
        return [];
      }
      try {
        // Check current needs and offers
        const [needsResponse, offersResponse] = await Promise.all([
          fetch(`${apiBaseUrl}/needs/user`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${apiBaseUrl}/offers/user`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const needs = await needsResponse.json();
        const offers = await offersResponse.json();

        // Fetch matches
        const response = await fetch(`${apiBaseUrl}/matches`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch matches: ${response.status} ${response.statusText}`);
        }

        const matches = await response.json();

        return matches;
      } catch (error) {
        console.error("Error in useUserMatches:", error);
        toast({
          title: "Error loading matches",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !!token && !!user?.id,
    retry: 2,
    refetchOnWindowFocus: false
  });
}

export function useMatchById(id: string) {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['match', id],
    queryFn: () => MatchesApi.getMatchById(id, token),
    enabled: !!token && !!id,
    retry: 1,
    refetchOnWindowFocus: false
  });
}

export function useCreateMatch() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (match: CreateMatchRequest) => {
      
      // Add validation to ensure at least one ID is provided
      if (!match.needId && !match.offerId) {
        throw new Error("Either a need ID or offer ID must be provided");
      }
      
      // Track the start time for performance monitoring
      const startTime = Date.now();
      
      // Call the API to create the match
      const result = await MatchesApi.createMatch(match, token);
      
      // Log performance metrics
      const duration = Date.now() - startTime;
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['user-matches'] });
      
      toast({
        title: "Success",
        description: "Match request sent successfully",
        variant: "default"
      });
    },
    onError: (error) => {
      console.error("Match creation error:", error);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create match",
        variant: "destructive"
      });
    }
  });
}

export function useUpdateMatchStatus() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMatchRequest }) => 
      MatchesApi.updateMatchStatus(id, data, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['match', data.id] });
      queryClient.invalidateQueries({ queryKey: ['user-matches'] });
      toast({
        title: "Success",
        description: "Match status updated successfully",
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update match status",
        variant: "destructive"
      });
    }
  });
}

export function useDeleteMatch() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (id: string) => MatchesApi.deleteMatch(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['user-matches'] });
      toast({
        title: "Success",
        description: "Match deleted successfully",
        variant: "default"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete match",
        variant: "destructive"
      });
    }
  });
}