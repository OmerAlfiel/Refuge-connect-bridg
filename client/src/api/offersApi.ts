
import { CreateOfferRequest, Offer, OfferCategory, OffersQueryParams, OfferStatus, UpdateOfferRequest } from '../types';
import { apiBaseUrl } from '../lib/api';



export const OffersApi = {
  getOffers: async (queryParams?: OffersQueryParams): Promise<Offer[]> => {
    const params = new URLSearchParams();
    if (queryParams?.category) params.append('category', queryParams.category);
    if (queryParams?.status) params.append('status', queryParams.status);
    if (queryParams?.search) params.append('search', queryParams.search);
    if (queryParams?.location) params.append('location', queryParams.location);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    
    const response = await fetch(`${apiBaseUrl}/offers${queryString}`);
    if (!response.ok) {
      throw new Error('Failed to fetch offers');
    }
    return await response.json();
  },

  getOfferById: async (id: string): Promise<Offer> => {
    const response = await fetch(`${apiBaseUrl}/offers/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch offer');
    }
    return await response.json();
  },

  getUserOffers: async (token: string): Promise<Offer[]> => {
    const response = await fetch(`${apiBaseUrl}/offers/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user offers');
    }
    return await response.json();
  },

  createOffer: async (offer: CreateOfferRequest, token: string): Promise<Offer> => {
    try {
      const response = await fetch(`${apiBaseUrl}/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(offer)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server error response:", errorData);
        
        const errorMessage = errorData.message || `Failed to create offer: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error in createOffer:", error);
      throw error;
    }
  },

  updateOffer: async (id: string, offer: UpdateOfferRequest, token: string): Promise<Offer> => {
    const response = await fetch(`${apiBaseUrl}/offers/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(offer)
    });
    if (!response.ok) {
      throw new Error('Failed to update offer');
    }
    return await response.json();
  },

  incrementHelpedCount: async (id: string, token: string): Promise<Offer> => {
    const response = await fetch(`${apiBaseUrl}/offers/${id}/helped`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to update helped count');
    }
    return await response.json();
  },

  deleteOffer: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${apiBaseUrl}/offers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete offer');
    }
  }
};