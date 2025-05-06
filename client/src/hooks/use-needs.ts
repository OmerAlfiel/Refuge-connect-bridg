import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { CreateNeedRequest, NeedsQueryParams, NeedStatus, UpdateNeedRequest } from '../types';
import { NeedsApi } from '@/api/needsApi';

export function useNeeds(queryParams?: NeedsQueryParams) {
  return useQuery({
    queryKey: ['needs', queryParams],
    queryFn: () => NeedsApi.getNeeds(queryParams),
  });
}

export function useNeedById(id: string) {
  return useQuery({
    queryKey: ['need', id],
    queryFn: () => NeedsApi.getNeedById(id),
    enabled: !!id,
  });
}

export function useUserNeeds() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['user-needs'],
    queryFn: () => NeedsApi.getUserNeeds(token),
    enabled: !!token,
  });
}

export function useCreateNeed() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (need: CreateNeedRequest) => NeedsApi.createNeed(need, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['needs'] });
      queryClient.invalidateQueries({ queryKey: ['user-needs'] });
    },
  });
}

export function useUpdateNeed() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, need }: { id: string; need: UpdateNeedRequest }) => 
      NeedsApi.updateNeed(id, need, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['needs'] });
      queryClient.invalidateQueries({ queryKey: ['need', data.id] });
      queryClient.invalidateQueries({ queryKey: ['user-needs'] });
    },
  });
}

export function useUpdateNeedStatus() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: NeedStatus }) => 
      NeedsApi.updateNeedStatus(id, status, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['needs'] });
      queryClient.invalidateQueries({ queryKey: ['need', data.id] });
      queryClient.invalidateQueries({ queryKey: ['user-needs'] });
    },
  });
}

export function useDeleteNeed() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => NeedsApi.deleteNeed(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['needs'] });
      queryClient.invalidateQueries({ queryKey: ['user-needs'] });
    },
  });
}