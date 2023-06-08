import { date } from 'quasar';
import { Booking } from 'src/api/bookingApi';
import { ComputedRef, computed } from 'vue';

export interface TimeSlot {
  from: Date;
  to: Date;
  label: string;
  booking?: Booking;
}

export default function useBookingTimeSlots() {
  const bookableTimeRange = [10, 22];

  const timeSlots: ComputedRef<TimeSlot[]> = computed(() => {
    const slots = [];
    for (let i = bookableTimeRange[0]; i <= bookableTimeRange[1]; i += 1) {
      if (i < bookableTimeRange[1]) {
        const firstTime = date.buildDate({
          hours: i,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        });
        const middleTime = date.addToDate(firstTime, { minutes: 30 });
        const lastTime = date.addToDate(middleTime, { minutes: 30 });
        slots.push({
          from: firstTime,
          to: middleTime,
          label: `${i}:00 - ${i}:30`,
        });
        slots.push({
          from: middleTime,
          to: lastTime,
          label: `${i}:30 - ${i + 1}:00`,
        });
      }
    }
    return slots;
  });

  return {
    timeSlots,
  };
}
