import { StrapiGeneral, StrapiImage } from 'src/interfaces/StrapiInterfaces';

export interface TeamMember extends StrapiGeneral {
  firstname: string;
  lastname: string;
  birthDate: string;
  position: string;
  height: number;
  shirtNumber: number;
  image: StrapiImage;
}
