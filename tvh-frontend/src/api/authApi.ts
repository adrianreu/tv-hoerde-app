import { api } from 'src/boot/axios';
import { StrapiGeneral } from 'src/interfaces/StrapiInterfaces';

export enum RoleType {
  Authenticated = 'authenticated',
  TeamEditor = 'teameditor',
  AppEditor = 'appeditor',
  Public = 'public'
}

export interface Role extends StrapiGeneral {
  description: string;
  type: RoleType;
  name: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  firstname: string;
  lastname: string;
  role?: Role;
}

export interface LoginResponse {
  jwt: string;
  user: User;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post('/api/auth/local', {
    data: {
      identifier: username,
      password,
    },
  });
  return data;
}
