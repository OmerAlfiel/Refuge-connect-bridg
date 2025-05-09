import { Match, CreateMatchRequest, MatchStatus, MatchesQueryParams, UpdateMatchRequest } from '../types';
import { apiBaseUrl } from '../lib/api';

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
    
    const response = await fetch(`${apiBaseUrl}/matches${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      // Get complete error response for debugging
      const responseText = await response.text();
      console.error('Error response text:', responseText);
      
      let errorData;
      try {
        errorData = JSON.parse(responseText);
        console.error('Parsed error data:', errorData);
      } catch (e) {
        console.error('Could not parse error response as JSON');
        throw new Error(`Failed to fetch matches: ${response.status} ${response.statusText} - ${responseText}`);
      }
      
      throw new Error(errorData.message || `Failed to fetch matches: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    
    // Validate data
    if (!Array.isArray(data)) {
      console.error('Expected array of matches but received:', typeof data);
      return [];
    }
    
    return data;
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
        const responseText = await response.text();
        console.error('Create match error response:', responseText);
        
        let errorMessage = `Failed to create match: ${response.status} ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
          
          if (errorMessage.includes('category mismatch') || 
              errorMessage.includes('Category mismatch')) {
            errorMessage = `Category mismatch: The need and offer categories don't match.`;
          }
        } catch (e) {
          // If we can't parse the error response, use the raw text
          if (responseText) {
            errorMessage += ` - ${responseText}`;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      const createdMatch = await response.json();
      return createdMatch;
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