import { api } from 'src/boot/axios';

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
}

export interface LoginResponse {
  jwt: string;
  user: User;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post('/api/auth/local', {
    identifier: username,
    password,
  });
  return data;
}
