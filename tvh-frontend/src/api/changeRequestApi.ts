import { api } from 'src/boot/axios';
import { StrapiGeneral } from 'src/interfaces/StrapiInterfaces';
import { mapStrapiData } from './strapiMapper';
import { Booking } from './bookingApi';
import { User } from './authApi';

export enum ChangeRequestStatus {
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
  REQUESTED = 'REQUESTED',
}

export interface ChangeRequest extends StrapiGeneral {
  from: Date;
  to: Date;
  message: string;
  booking: Booking;
  status: ChangeRequestStatus;
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
        $or: [
          {
            booking: {
              bookedBy: {
                id: {
                  $eq: userId,
                },
              },
            },
          },
          {
            requestedBy: {
              id: {
                $eq: userId,
              },
            },
          },
        ],
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

export async function acceptChangeRequest(id: number | string): Promise<ChangeRequest> {
  const { data } = await api.post(`/api/change-requests/${id}/accept`);
  return mapStrapiData(data.data);
}

export async function rejectChangeRequest(id: number | string): Promise<ChangeRequest> {
  const { data } = await api.post(`/api/change-requests/${id}/reject`);
  return mapStrapiData(data.data);
}
