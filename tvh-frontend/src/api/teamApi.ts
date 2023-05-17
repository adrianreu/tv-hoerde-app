import { api } from 'src/boot/axios';
import { StrapiGeneral, StrapiImage } from 'src/interfaces/StrapiInterfaces';
import { mapStrapiData } from './strapiMapper';
import { TeamMember } from './teamMemberApi';
import { TrainingTime } from './trainingTimeApi';

export interface Team extends StrapiGeneral {
  name: string;
  league?: string;
  teamImage?: StrapiImage;
  teamMembers?: TeamMember[];
  trainingTimes?: TrainingTime[];
}

export async function getTeams(): Promise<Team[]> {
  const { data } = await api.get('/api/teams/', {
    params: {
      populate: {
        teamImage: '*',
      },
    },
  });

  return mapStrapiData(data?.data) || [];
}

export async function getTeam(id: number | string): Promise<Team> {
  const { data } = await api.get(`/api/teams/${id}`, {
    params: {
      populate: {
        teamImage: '*',
        trainingTimes: {
          populate: ['place'],
        },
        teamMembers: {
          populate: ['image'],
        },
      },
    },
  });

  return mapStrapiData(data?.data);
}
