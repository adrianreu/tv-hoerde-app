import { StrapiGeneral } from 'src/interfaces/StrapiInterfaces';
import { api } from 'src/boot/axios';
import { Place } from './placeApi';
import { mapStrapiData } from './strapiMapper';

export interface TrainingTime extends StrapiGeneral {
  dayOfWeek: number;
  from: string;
  to: string;
  place: Place;
}

export interface TrainingTimeRequest {
  dayOfWeek: number;
  from: string;
  to: string;
  place?: number;
  teams?: number[];
}

const baseUrl = '/api/training-times';

export async function createTrainingTime(trainingTime: TrainingTimeRequest): Promise<TrainingTime> {
  const { data } = await api.post(baseUrl, {
    data: trainingTime,
    params: {
      populate: '*',
    },
  });
  return mapStrapiData(data.data);
}

export async function deleteTrainingTime(id: string | number) {
  return api.delete(`${baseUrl}/${id}`);
}
