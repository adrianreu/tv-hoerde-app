import { defineStore } from 'pinia';
import { getEvents, Event } from 'src/api/eventApi';
import { extractISODate } from 'src/api/format';
import { date } from 'quasar';
import { Plugins } from '@capacitor/core';
import useNotify, { NotifyType } from 'src/hooks/useNotify';

const { LocalNotifications } = Plugins;
const { show } = useNotify();

function getId() {
  return `${new Date().getTime().toString().substring(6)}${Math.floor(Math.random() * 1000)}`;
}

export type RootState = {
  events: Event[]
  notifications: { event: Event, notifications: any[] }[]
}

export const useEventStore = defineStore('event', {
  state: () => ({
    events: [],
    notifications: [],
  } as RootState),
  getters: {
    getEvents: (state) => state.events,
    sortByDate: (state) => {
      const sortedEvents: any = {};
      state.events.forEach((event) => {
        const extractedDate = extractISODate(event.date);
        const formattedDate = date.formatDate(extractedDate, 'DD.MM.YYYY');
        if (sortedEvents[formattedDate] !== undefined) {
          sortedEvents[formattedDate].push(event);
        } else {
          sortedEvents[formattedDate] = [event];
        }
      });
      return sortedEvents;
    },
  },
  actions: {
    async fetchEvents() {
      try {
        this.events = await getEvents();
      } catch (error) {
        show('Events konnten nicht geladen werden. Bitte versuche es erneut.', NotifyType.Error);
      }
    },
    async setSchedule(event: Event) {
      const eventDate = new Date(event.date);
      const dateOneDayBefore = date.subtractFromDate(eventDate, { days: 1 });
      const dateOneHourBefore = date.subtractFromDate(eventDate, { hours: 1 });
      const newNotifications = await LocalNotifications.schedule({
        notifications: [
          {
            title: event.name,
            body: 'Morgen gehts los. Noch 1 Tag bis zum Anpfiff.',
            id: getId(),
            schedule: { at: dateOneDayBefore },
            sound: null,
            attachments: null,
            actionTypeId: '',
            extra: null,
          },
          {
            title: event.name,
            body: 'Gleich gehts los. Noch 1 Stunde bis zum Anpfiff.',
            id: getId(),
            schedule: { at: dateOneHourBefore },
            sound: null,
            attachments: null,
            actionTypeId: '',
            extra: null,
          },
        ],
      });

      console.log('created notification for', event.name, dateOneDayBefore);
      console.log('created notification for', event.name, dateOneHourBefore);

      this.notifications.push({
        event,
        notifications: newNotifications,
      });
    },
    async cancelNotification(event: Event) {
      const eventNotifications = this.notifications.find((notify) => notify.event.id === event.id);
      await LocalNotifications.cancel(eventNotifications?.notifications);
      this.notifications = this.notifications.filter((notify) => notify.event.id === event.id);
    },
  },
});
