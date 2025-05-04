
export type UserRole = 'refugee' | 'volunteer' | 'ngo' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  location?: Location;
  language: string;
  contact?: string;
  verified: boolean;
  avatar?: string;
  email: string; // Add email property to fix TypeScript error
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
  city?: string;
  country?: string;
}

export type NeedCategory = 
  | 'shelter'
  | 'food'
  | 'medical'
  | 'legal'
  | 'education'
  | 'employment'
  | 'translation'
  | 'transportation'
  | 'other';

export type NeedStatus = 'open' | 'matched' | 'fulfilled' | 'closed';

export interface Need {
  id: string;
  userId: string;
  category: NeedCategory;
  title: string;
  description: string;
  location?: Location;
  status: NeedStatus;
  createdAt: Date;
  urgent: boolean;
}

export interface Offer {
  id: string;
  userId: string;
  category: NeedCategory;
  title: string;
  description: string;
  location?: Location;
  availability: {
    startDate?: Date;
    endDate?: Date;
    recurring?: boolean;
  };
  createdAt: Date;
}

export type DocumentType = 'id' | 'medical' | 'legal' | 'educational' | 'other';

export interface Document {
  id: string;
  userId: string;
  fileUrl: string;
  type: DocumentType;
  name: string;
  uploadedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  region?: string;
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
}
