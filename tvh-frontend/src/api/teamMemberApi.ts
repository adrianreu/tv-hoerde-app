import { api } from 'src/boot/axios';
import { StrapiGeneral, StrapiImage } from 'src/interfaces/StrapiInterfaces';
import { mapStrapiData } from './strapiMapper';

export interface TeamMember extends StrapiGeneral {
  firstname: string;
  lastname: string;
  birthDate: string;
  position: string;
  height: number;
  shirtNumber: number;
  image: StrapiImage;
}

export interface TeamMemberRequest {
  firstname: string;
  lastname: string;
  birthDate: string;
  position: string;
  height: number;
  shirtNumber: number;
  image?: File;
  teams?: number[]
}

export async function createTeamMember(teamMember: TeamMemberRequest): Promise<TeamMember> {
  const { data } = await api.post('/api/team-members', {
    data: {
      ...teamMember,
      image: undefined,
    },
  });
  const newTeamMember = mapStrapiData(data.data);
  if (teamMember.image) {
    const form = new FormData();
    form.append('files', teamMember.image);
    form.append('refId', newTeamMember.id);
    form.append('ref', 'api::team-member.team-member');
    form.append('field', 'image');
    const uploadResponse = await api.post('http://127.0.0.1:9123/api/upload', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // eslint-disable-next-line prefer-destructuring
    newTeamMember.image = uploadResponse.data[0];
  }
  return newTeamMember;
}

export async function deleteTeamMember(id: string | number) {
  return api.delete(`/api/team-members/${id}`);
}
