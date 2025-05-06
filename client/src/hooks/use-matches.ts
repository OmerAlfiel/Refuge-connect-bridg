import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MatchesApi } from '../api/matchesApi';
import { useAuth } from '../context/AuthContext';
import { CreateMatchRequest, MatchStatus, UpdateMatchRequest, MatchesQueryParams } from '../types';
import { useToast } from './use-toast';

export function useMatches(needId?: string, offerId?: string, status?: MatchStatus) {
  const { token } = useAuth();
  const queryParams: MatchesQueryParams = { needId, offerId, status };
  
  return useQuery({
    queryKey: ['matches', queryParams],
    queryFn: () => MatchesApi.getMatches(queryParams, token),
    enabled: !!token && (!!needId || !!offerId || !!status),
    retry: 1,
    refetchOnWindowFocus: false,
    meta: {
      onError: (error) => {
        console.error("Error fetching matches:", error);
      }
    }
  });
}

export function useUserMatches() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['user-matches'],
    queryFn: () => MatchesApi.getMatches({}, token),
    enabled: !!token,
    retry: 1,
    refetchOnWindowFocus: false,
    meta: {
    onError: (error) => {
      console.error("Error fetching user matches:", error);
    }
  }
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
      try {
        console.log("Creating match:", match);
        const result = await MatchesApi.createMatch(match, token);
        console.log("Match created successfully:", result);
        return result;
      } catch (error) {
        console.error("Error creating match:", error);
        throw error;
      }
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
      console.error("Match creation failed:", error);
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