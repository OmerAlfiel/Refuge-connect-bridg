
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
  email: string;
  organizationName?: string;
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
  | 'clothing'
  | 'housing'
  | 'other';

export type NeedStatus = 'open' | 'matched' | 'fulfilled' | 'closed';

export interface Need {
  id: string;
  title: string;
  description: string;
  category: NeedCategory;
  urgent: boolean;
  status: NeedStatus;
  location?: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    country?: string;
  };
  userId: string;
  user?: User;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type OfferCategory = 
  | 'shelter'
  | 'food'
  | 'medical'
  | 'legal'
  | 'education'
  | 'employment'
  | 'translation'
  | 'transportation'
  | 'housing'
  | 'other';


export type OfferStatus = 'active' | 'paused' | 'cancelled' | 'completed'; 

export interface Offer {
  id: string;
  title: string;
  description: string;
  category: OfferCategory;
  status: OfferStatus;
  location?: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    country?: string;
  };
  contact?: {
    name?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  availability?: {
    startDate?: Date;
    endDate?: Date;
    recurring?: boolean;
    schedule?: string;
  };
  userId: string;
  user?: User;
  helpedCount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}


export interface CreateOfferRequest {
  title: string;
  description: string;
  category: OfferCategory;
  location?: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    country?: string;
  };
  contact?: {
    name?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  availability?: {
    startDate?: string;
    endDate?: string;
    recurring?: boolean;
    schedule?: string;
  };
}

export interface UpdateOfferRequest {
  title?: string;
  description?: string;
  category?: OfferCategory;
  status?: OfferStatus;
  location?: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    country?: string;
  };
  contact?: {
    name?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  availability?: {
    startDate?: string;
    endDate?: string;
    recurring?: boolean;
    schedule?: string;
  };
}

export interface OffersQueryParams {
  category?: OfferCategory;
  status?: OfferStatus;
  search?: string;
  location?: string;
}



export interface CreateNeedRequest {
  title: string;
  description: string;
  category: NeedCategory;
  urgent: boolean;
  location?: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    country?: string;
  };
}

export interface UpdateNeedRequest {
  title?: string;
  description?: string;
  category?: NeedCategory;
  urgent?: boolean;
  status?: NeedStatus;
  location?: {
    lat: number;
    lng: number;
    address?: string;
    city?: string;
    country?: string;
  };
}

export interface NeedsQueryParams {
  category?: NeedCategory;
  urgent?: boolean;
  status?: NeedStatus;
  search?: string;
  userId?: string;
}



export type MatchStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface Match {
  id: string;
  needId: string;
  offerId: string;
  need?: Need;
  offer?: Offer;
  status: MatchStatus;
  message?: string;
  initiatedBy: string; // userId
  respondedBy?: string; // userId
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateMatchRequest {
  needId: string | null;
  offerId: string | null;
  message?: string;
}

export interface UpdateMatchRequest {
  status: MatchStatus;
  message?: string;
}

export interface MatchesQueryParams {
  status?: MatchStatus;
  needId?: string;
  offerId?: string;
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



export interface Message {
  id: string;
  content: string;
  sender: User;
  senderId: string;
  conversationId: string;
  read: boolean;
  timestamp: Date;
}


export interface Conversation {
  id: string;
  participants: User[];
  messages?: Message[];
  lastMessage?: string | null;
  lastMessageAt?: Date | string | null;
  hasUnread?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CreateConversationRequest {
  participantIds: string[];
  initialMessage?: string;
}

export interface CreateMessageRequest {
  content: string;
  conversationId: string;
}


export enum NotificationType {
  MATCH = 'match',
  MESSAGE = 'message',
  SYSTEM = 'system',
  OFFER = 'offer',
  ANNOUNCEMENT = 'announcement',
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  recipientId: string;
  entityId?: string;
  read: boolean;
  actionTaken: boolean;
  createdAt: string;
}



export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  region: string;
  postedBy: {
    id: string;
    firstName?: string;
    lastName?: string;
    username: string;
  };
  postedById: string;
  eventDate?: string;
  important: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementRequest {
  id?: string; // Used for editing existing announcements
  title: string;
  content: string;
  category: string;
  region: string;
  important: boolean;
  eventDate?: Date;
}

export interface AnnouncementSubscription {
  email: string;
  categories?: string[];
  regions?: string[];
}