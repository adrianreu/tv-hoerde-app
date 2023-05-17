import { StrapiGeneral } from 'src/interfaces/StrapiInterfaces';
import { api } from 'src/boot/axios';
import { mapStrapiData, toStrapiPagination } from './strapiMapper';

export interface Place extends StrapiGeneral {
  street: string;
  name: string;
  zipCode: string;
  houseNumber: string;
  country: string;
  city: string;
}

export async function getPlaces(): Promise<Place[]> {
  const { data } = await api.get('/api/places', {
    params: {
      populate: '*',
      ...toStrapiPagination(1, 20),
      sort: ['date'],
    },
  });

  return mapStrapiData(data?.data);
}
