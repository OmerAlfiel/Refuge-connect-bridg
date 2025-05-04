import { UserRole } from '../interfaces/user-role.enum';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  language: string;
  verified: boolean;
  avatar?: string;
  contact?: string;
  location?: {
    lat?: number;
    lng?: number;
    address?: string;
    city?: string;
    country?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}