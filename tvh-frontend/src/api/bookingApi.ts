import { api } from 'src/boot/axios';
import { StrapiGeneral } from 'src/interfaces/StrapiInterfaces';
import { date } from 'quasar';
import { mapStrapiData } from './strapiMapper';
import { User } from './authApi';
import { BookableCourt } from './bookableCourtApi';

export interface Booking extends StrapiGeneral {
  bookedBy: User;
  startTime: string;
  endTime: string;
  bookedCourt: BookableCourt;
}

export interface BookingRequest {
  bookedBy: number;
  startTime: Date;
  endTime: Date;
  bookedCourt: number;
}

export async function getBookings(placeId?: number, forDate?: Date): Promise<Booking[]> {
  let dayStart;
  let dayEnd;
  if (forDate) {
    dayStart = date.adjustDate(forDate, {
      hour: 0, minute: 0, second: 0, millisecond: 0,
    });
    dayEnd = date.adjustDate(forDate, {
      hour: 23, minute: 59, second: 59, millisecond: 0,
    });
  }
  const { data } = await api.get('/api/bookings', {
    params: {
      populate: '*',
      filters: {
        bookedCourt: {
          place: {
            id: {
              $eq: placeId,
            },
          },
        },
        $and: [
          {
            startTime: {
              $gte: dayStart,
            },
          },
          {
            endTime: {
              $lte: dayEnd,
            },
          },
        ],

      },
    },
  });

  return mapStrapiData(data?.data);
}

export async function createBooking(booking: BookingRequest): Promise<Booking> {
  const { data } = await api.post('/api/bookings', {
    data: booking,
  }, {
    params: {
      populate: '*',
    },
  });
  return mapStrapiData(data.data);
}

export async function deleteBooking(id: string | number) {
  return api.delete(`/api/bookings/${id}`);
}
