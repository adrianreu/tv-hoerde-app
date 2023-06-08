import { api } from 'src/boot/axios';
import { StrapiGeneral } from 'src/interfaces/StrapiInterfaces';
import { date } from 'quasar';
import { mapStrapiData } from './strapiMapper';
import { Booking } from './bookingApi';
import { User } from './authApi';

export interface ChangeRequest extends StrapiGeneral {
  from: Date;
  to: Date;
  message: string;
  booking: Booking;
  requestedBy: User;
}

export interface ChangeRequestRequest {
  from: Date;
  to: Date;
  message: string;
  booking: number;
  requestedBy: number;
}

export async function getChangeRequestsForUser(userId?: number): Promise<ChangeRequest[]> {
  const { data } = await api.get('/api/change-requests', {
    params: {
      populate: {
        booking: {
          populate: {
            bookedCourt: '*',
          },
        },
        requestedBy: '*',
      },
      filters: {
        booking: {
          bookedBy: {
            id: {
              $eq: userId,
            },
          },
        },
      },
    },
  });

  return mapStrapiData(data?.data);
}

export async function createChangeRequest(
  changeRequest: ChangeRequestRequest,
): Promise<ChangeRequest> {
  const { data } = await api.post('/api/change-requests', {
    data: { data: changeRequest },
    params: {
      populate: '*',
    },
  });
  return mapStrapiData(data.data);
}
