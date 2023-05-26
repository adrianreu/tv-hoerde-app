import { api } from 'src/boot/axios';
import { StrapiGeneral } from 'src/interfaces/StrapiInterfaces';
import { Place } from './placeApi';
import { mapStrapiData } from './strapiMapper';

export interface BookableCourt extends StrapiGeneral {
  name: string;
  place?: Place;
}

export async function getBookableCourts(placeId?: number): Promise<BookableCourt[]> {
  const { data } = await api.get('/api/bookable-courts', {
    params: {
      populate: '*',
      filters: {
        place: {
          id: {
            $eq: placeId,
          },
        },
      },
    },
  });

  return mapStrapiData(data?.data);
}
