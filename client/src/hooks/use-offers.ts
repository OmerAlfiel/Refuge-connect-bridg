import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuth } from '../context/AuthContext';
import { CreateOfferRequest, OffersQueryParams, UpdateOfferRequest } from '@/types';
import { OffersApi } from '@/api/offersApi';


export function useOffers(queryParams?: OffersQueryParams) {
  return useQuery({
    queryKey: ['offers', queryParams],
    queryFn: () => OffersApi.getOffers(queryParams),
  });
}

export function useOfferById(id: string) {
  return useQuery({
    queryKey: ['offer', id],
    queryFn: () => OffersApi.getOfferById(id),
    enabled: !!id,
  });
}

export function useUserOffers() {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['user-offers'],
    queryFn: () => OffersApi.getUserOffers(token),
    enabled: !!token,
  });
}

export function useCreateOffer() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (offer: CreateOfferRequest) => {
      
      return OffersApi.createOffer(offer, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['user-offers'] });
    },
    onError: (error) => {
      console.error("Error creating offer:", error);
    }
  });
}

export function useUpdateOffer() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, offer }: { id: string; offer: UpdateOfferRequest }) => 
      OffersApi.updateOffer(id, offer, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['offer', data.id] });
      queryClient.invalidateQueries({ queryKey: ['user-offers'] });
    },
  });
}

export function useIncrementHelpedCount() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => OffersApi.incrementHelpedCount(id, token),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['offer', data.id] });
      queryClient.invalidateQueries({ queryKey: ['user-offers'] });
    },
  });
}

export function useDeleteOffer() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => OffersApi.deleteOffer(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offers'] });
      queryClient.invalidateQueries({ queryKey: ['user-offers'] });
    },
  });
}