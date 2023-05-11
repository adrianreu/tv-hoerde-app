import { date } from 'quasar';

export function extractISODate(toFormat: string) {
  return date.extractDate(toFormat, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
}

export function timeToHourMinute(toFormat: string) {
  return date.formatDate(date.extractDate(toFormat, 'HH:mm:ss.SSS'), 'HH:mm');
}

export function dateToHourMinute(toFormat: string) {
  return date.formatDate(extractISODate(toFormat), 'HH:mm');
}

export function toGermanDate(toFormat: string) {
  return date.formatDate(
    extractISODate(toFormat),
    'DD.MM.YYYY',
  );
}
