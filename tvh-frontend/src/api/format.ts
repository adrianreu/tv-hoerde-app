import { date } from 'quasar';

export function extractISODate(toFormat: string): Date {
  return date.extractDate(toFormat, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
}

export function timeToHourMinute(toFormat: string): string {
  return date.formatDate(date.extractDate(toFormat, 'HH:mm:ss.SSS'), 'HH:mm');
}

export function dateToHourMinute(toFormat: string): string {
  return date.formatDate(extractISODate(toFormat), 'HH:mm');
}

export function toGermanDate(toFormat: string): string {
  return date.formatDate(
    extractISODate(toFormat),
    'DD.MM.YYYY',
  );
}

export function toGermanWeekdayDate(toFormat: string): string {
  return date.formatDate(
    extractISODate(toFormat),
    'dddd, DD.MM.YYYY',
    {
      days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
      daysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    },
  );
}

export function toGermanDateTime(toFormat: string): string {
  return date.formatDate(
    extractISODate(toFormat),
    'DD.MM.YYYY HH:mm',
  );
}
