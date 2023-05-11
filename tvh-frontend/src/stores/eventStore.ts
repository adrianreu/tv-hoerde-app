import { defineStore } from 'pinia';
import { getEvents, Event } from 'src/api/eventApi';
import { extractISODate } from 'src/api/format';
import { date } from 'quasar';

export type RootState = {
  events: Event[]
}

export const useEventStore = defineStore('event', {
  state: () => ({
    events: [],
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
        console.log(error);
      }
    },
  },
});
