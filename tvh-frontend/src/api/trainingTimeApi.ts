import { StrapiGeneral } from 'src/interfaces/StrapiInterfaces';
import { Place } from './placeApi';

export interface TrainingTime extends StrapiGeneral {
  dayOfWeek: number;
  from: string;
  to: string;
  place: Place;
}
