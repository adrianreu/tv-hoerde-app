import { StrapiGeneral } from 'src/interfaces/StrapiInterfaces';
import { api } from 'src/boot/axios';
import { date } from 'quasar';
import { Place } from './placeApi';
import { mapStrapiData, toStrapiPagination } from './strapiMapper';

export interface Event extends StrapiGeneral {
  name: string;
  date: string;
  place: Place;
}

export async function getEvents(): Promise<Event[]> {
  const newDate = new Date();
  const adjustedDate = date.adjustDate(newDate, {
    second: 0, minute: 0, millisecond: 0, hour: 0,
  });
  const { data } = await api.get('/api/events', {
    params: {
      populate: '*',
      'filters[date][$gte]': adjustedDate.toISOString(),
      ...toStrapiPagination(1, 20),
      'sort[0]': 'date',
    },
  });

  return mapStrapiData(data?.data);
}
