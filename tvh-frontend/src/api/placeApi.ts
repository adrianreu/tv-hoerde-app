import { StrapiGeneral } from 'src/interfaces/StrapiInterfaces';

export interface Place extends StrapiGeneral {
  street: string;
  name: string;
  zipCode: string;
  houseNumber: string;
  country: string;
  city: string;
}
