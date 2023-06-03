import { StrapiGeneral } from 'src/interfaces/StrapiInterfaces';
import { api } from 'src/boot/axios';
import { date } from 'quasar';
import { Place } from './placeApi';
import { mapStrapiData, toStrapiPagination } from './strapiMapper';

export interface Event extends StrapiGeneral {
  name: string;
  date: string;
  place?: Place;
}

export interface EventRequest {
  name: string;
  date: string;
  place?: number;
}

export async function getEvents(): Promise<Event[]> {
  const newDate = new Date();
  const adjustedDate = date.adjustDate(newDate, {
    second: 0, minute: 0, millisecond: 0, hour: 0,
  });
  const { data } = await api.get('/api/events', {
    params: {
      populate: '*',
      filters: {
        date: {
          $gte: adjustedDate.toISOString(),
        },
      },
      ...toStrapiPagination(1, 20),
      sort: ['date'],
    },
  });

  return mapStrapiData(data?.data);
}

export async function getEvent(id: number | string): Promise<Event> {
  const { data } = await api.get(`/api/events/${id}`, {
    params: {
      populate: '*',
    },
  });

  return mapStrapiData(data?.data);
}

export async function createEvent(event: EventRequest): Promise<Event> {
  const { data } = await api.post('/api/events', {
    data: { data: event },
  });
  return mapStrapiData(data.data);
}
