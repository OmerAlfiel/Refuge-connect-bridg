import { Match, CreateMatchRequest, MatchStatus, MatchesQueryParams, UpdateMatchRequest } from '../types';
import { apiBaseUrl } from './api';

export const MatchesApi = {
  getMatches: async (queryParams: MatchesQueryParams = {}, token: string): Promise<Match[]> => {
    try {
      if (!token || token === 'undefined' || token === 'null') {
        console.warn('Invalid token in getMatches:', token);
        return [];
      }
      
      const params = new URLSearchParams();
      if (queryParams?.status) params.append('status', queryParams.status);
      if (queryParams?.needId) params.append('needId', queryParams.needId);
      if (queryParams?.offerId) params.append('offerId', queryParams.offerId);

      const queryString = params.toString() ? `?${params.toString()}` : '';
      
      console.log(`Fetching matches from: ${apiBaseUrl}/matches${queryString}`);
      
      const response = await fetch(`${apiBaseUrl}/matches${queryString}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error fetching matches:', errorData);
        throw new Error(errorData.message || `Failed to fetch matches: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching matches:", error);
      return []; // Return empty array on error to prevent UI crashes
    }
  },

  getMatchById: async (id: string, token: string): Promise<Match> => {
    try {
      const response = await fetch(`${apiBaseUrl}/matches/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch match');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching match ${id}:`, error);
      throw error;
    }
  },
  
  createMatch: async (match: CreateMatchRequest, token: string): Promise<Match> => {
    try {
      console.log("Creating match with data:", JSON.stringify(match, null, 2));
      
      if (!token) {
        throw new Error('Authentication token is missing');
      }
      
      // Validate the match request
      if (match.needId === null && match.offerId === null) {
        throw new Error('Either needId or offerId must be provided');
      }
      
      const response = await fetch(`${apiBaseUrl}/matches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(match)
      });
      
      if (!response.ok) {
        // Get response as text first to debug
        const responseText = await response.text();
        
        // Try to parse as JSON if possible
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          throw new Error(`Invalid server response: ${responseText}`);
        }
        
        throw new Error(errorData.message || `Failed to create match (${response.status}): ${errorData.error || 'Unknown error'}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Match creation error:", error);
      throw error;
    }
  },

  updateMatchStatus: async (id: string, updateData: UpdateMatchRequest, token: string): Promise<Match> => {
    try {
      const response = await fetch(`${apiBaseUrl}/matches/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(`Invalid response: ${errorText}`);
        }
        
        throw new Error(errorData.message || 'Failed to update match status');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating match ${id}:`, error);
      throw error;
    }
  },

  deleteMatch: async (id: string, token: string): Promise<void> => {
    try {
      const response = await fetch(`${apiBaseUrl}/matches/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete match');
      }
    } catch (error) {
      console.error(`Error deleting match ${id}:`, error);
      throw error;
    }
  }
};