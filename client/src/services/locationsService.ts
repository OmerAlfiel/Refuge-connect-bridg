import { LocationType, QueryOptions } from '@/types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const locationsService = {
  getAll: async (options: QueryOptions = {}): Promise<LocationType[]> => {
    try {
      const params = new URLSearchParams();
      
      if (options.search) params.append('search', options.search);
      if (options.type && options.type !== 'all') params.append('type', options.type);
      if (options.lat) params.append('lat', options.lat.toString());
      if (options.lng) params.append('lng', options.lng.toString());
      if (options.radius) params.append('radius', options.radius.toString());
      
      const response = await axios.get(`${API_URL}/locations?${params.toString()}`);
      
      // Transform the API data to match the client's expected format
      return response.data.map(location => ({
        id: location.id,
        name: location.name,
        type: location.type,
        address: location.address,
        coordinates: {
          lat: location.lat,
          lng: location.lng
        },
        description: location.description,
        services: location.services.map(service => service.name),
        contactInfo: location.contactInfo ? {
          phone: location.contactInfo.phone,
          email: location.contactInfo.email,
          website: location.contactInfo.website,
          hours: location.contactInfo.hours
        } : undefined
      }));
    } catch (error) {
      console.error('Error fetching locations:', error);
      throw error;
    }
  },
  
  getById: async (id: string): Promise<LocationType> => {
    try {
      const response = await axios.get(`${API_URL}/locations/${id}`);
      
      // Transform the API data to match the client's expected format
      return {
        id: response.data.id,
        name: response.data.name,
        type: response.data.type,
        address: response.data.address,
        coordinates: {
          lat: response.data.lat,
          lng: response.data.lng
        },
        description: response.data.description,
        services: response.data.services.map(service => service.name),
        contactInfo: response.data.contactInfo ? {
          phone: response.data.contactInfo.phone,
          email: response.data.contactInfo.email,
          website: response.data.contactInfo.website,
          hours: response.data.contactInfo.hours
        } : undefined
      };
    } catch (error) {
      console.error(`Error fetching location with ID ${id}:`, error);
      throw error;
    }
  },
  
  create: async (locationData: Omit<LocationType, 'id'>): Promise<LocationType> => {
    try {
      // Transform client data format to match API expectations
      const apiData = {
        name: locationData.name,
        type: locationData.type,
        address: locationData.address,
        lat: locationData.coordinates.lat,
        lng: locationData.coordinates.lng,
        description: locationData.description,
        services: locationData.services.map(service => ({ name: service })),
        contactInfo: locationData.contactInfo
      };
      
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/locations`, apiData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Transform response back to client format
      return {
        id: response.data.id,
        name: response.data.name,
        type: response.data.type,
        address: response.data.address,
        coordinates: {
          lat: response.data.lat,
          lng: response.data.lng
        },
        description: response.data.description,
        services: response.data.services.map(service => service.name),
        contactInfo: response.data.contactInfo ? {
          phone: response.data.contactInfo.phone,
          email: response.data.contactInfo.email,
          website: response.data.contactInfo.website,
          hours: response.data.contactInfo.hours
        } : undefined
      };
    } catch (error) {
      console.error('Error creating location:', error);
      throw error;
    }
  },
  
  update: async (id: string, locationData: Partial<Omit<LocationType, 'id'>>): Promise<LocationType> => {
    try {
      // Transform client data format to match API expectations
      interface ApiLocationData {
        name?: string;
        type?: string;
        address?: string;
        lat?: number;
        lng?: number;
        description?: string;
        services?: Array<{ name: string }>;
        contactInfo?: LocationType['contactInfo'];
      }
      
      const apiData: ApiLocationData = {};
      
      if (locationData.name) apiData.name = locationData.name;
      if (locationData.type) apiData.type = locationData.type;
      if (locationData.address) apiData.address = locationData.address;
      if (locationData.coordinates) {
        apiData.lat = locationData.coordinates.lat;
        apiData.lng = locationData.coordinates.lng;
      }
      if (locationData.description) apiData.description = locationData.description;
      if (locationData.services) {
        apiData.services = locationData.services.map(service => ({ name: service }));
      }
      if (locationData.contactInfo) apiData.contactInfo = locationData.contactInfo;
      
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${API_URL}/locations/${id}`, apiData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Transform response back to client format
      return {
        id: response.data.id,
        name: response.data.name,
        type: response.data.type,
        address: response.data.address,
        coordinates: {
          lat: response.data.lat,
          lng: response.data.lng
        },
        description: response.data.description,
        services: response.data.services.map(service => service.name),
        contactInfo: response.data.contactInfo ? {
          phone: response.data.contactInfo.phone,
          email: response.data.contactInfo.email,
          website: response.data.contactInfo.website,
          hours: response.data.contactInfo.hours
        } : undefined
      };
    } catch (error) {
      console.error(`Error updating location with ID ${id}:`, error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/locations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error(`Error deleting location with ID ${id}:`, error);
      throw error;
    }
  }
};