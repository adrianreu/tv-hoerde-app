import { api } from 'src/boot/axios';
import { StrapiGeneral, StrapiImage, StrapiUser } from 'src/interfaces/StrapiInterfaces';
import { mapStrapiData } from './strapiMapper';

export interface Team extends StrapiGeneral {
  id: number;
  name: string;
  league?: string;
  teamImage?: StrapiImage
}

export async function getTeams(): Promise<Team[]> {
  const { data } = await api.get('/api/teams/', {
    params: {
      populate: '*',
    },
  });

  return mapStrapiData(data?.data) || [];
}
