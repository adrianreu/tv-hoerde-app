import { api } from 'src/boot/axios';
import { StrapiGeneral, StrapiImage } from 'src/interfaces/StrapiInterfaces';
import { mapStrapiData } from './strapiMapper';
import { TeamMember } from './teamMemberApi';
import { TrainingTime } from './trainingTimeApi';

export interface Team extends StrapiGeneral {
  name: string;
  league: string;
  teamImage?: StrapiImage;
  teamMembers?: TeamMember[];
  trainingTimes?: TrainingTime[];
  recruitingText?: string;
  recruitingTitle?: string;
  recruitingButtonText?: string;
  isRecruiting: boolean;
  recruitingEmail?: string;
}

export interface TeamRequest {
  name: string;
  league: string;
  teamImage?: StrapiImage;
  teamMembers?: TeamMember[];
  trainingTimes?: TrainingTime[];
  recruitingText?: string;
  recruitingTitle?: string;
  recruitingButtonText?: string;
  isRecruiting: boolean;
  recruitingEmail?: string;
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

export async function updateTeam(id: number | string, team: TeamRequest): Promise<Team> {
  const { data } = await api.put(`/api/teams/${id}`, {
    data: {
      data: {
        ...team,
        teamMembers: undefined,
        trainingTimes: undefined,
        teamImage: undefined,
      },
    },
  });

  return mapStrapiData(data?.data);
}
