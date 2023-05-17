import { api } from 'src/boot/axios';
import { User } from './authApi';

export async function getMe(): Promise<User> {
  const { data } = await api.get('/api/users/me');

  return data;
}
