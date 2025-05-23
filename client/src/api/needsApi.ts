import { CreateNeedRequest, Need, NeedCategory, NeedsQueryParams, NeedStatus, UpdateNeedRequest } from '../types';
import { apiBaseUrl } from '../lib/api';




export const NeedsApi = {
  getNeeds: async (queryParams?: NeedsQueryParams): Promise<Need[]> => {
    const params = new URLSearchParams();
    if (queryParams?.category) params.append('category', queryParams.category);
    if (queryParams?.urgent) params.append('urgent', 'true');
    if (queryParams?.status) params.append('status', queryParams.status);
    if (queryParams?.search) params.append('search', queryParams.search);

    const queryString = params.toString() ? `?${params.toString()}` : '';
    
    const response = await fetch(`${apiBaseUrl}/needs${queryString}`);
    if (!response.ok) {
      throw new Error('Failed to fetch needs');
    }
    return await response.json();
  },

  getNeedById: async (id: string): Promise<Need> => {
    const response = await fetch(`${apiBaseUrl}/needs/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch need');
    }
    return await response.json();
  },

  getUserNeeds: async (token: string): Promise<Need[]> => {
    const response = await fetch(`${apiBaseUrl}/needs/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user needs');
    }
    return await response.json();
  },

  createNeed: async (need: CreateNeedRequest, token: string): Promise<Need> => {
    const response = await fetch(`${apiBaseUrl}/needs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(need)
    });
    if (!response.ok) {
      throw new Error('Failed to create need');
    }
    return await response.json();
  },

  updateNeed: async (id: string, need: UpdateNeedRequest, token: string): Promise<Need> => {
    const response = await fetch(`${apiBaseUrl}/needs/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(need)
    });
    if (!response.ok) {
      throw new Error('Failed to update need');
    }
    return await response.json();
  },

  updateNeedStatus: async (id: string, status: NeedStatus, token: string): Promise<Need> => {
    const response = await fetch(`${apiBaseUrl}/needs/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) {
      throw new Error('Failed to update need status');
    }
    return await response.json();
  },

  deleteNeed: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${apiBaseUrl}/needs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete need');
    }
  }
};