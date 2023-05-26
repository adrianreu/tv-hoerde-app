<template>
  <q-page padding>
    <loading-wrapper :loading="loading">
      <div class="row q-col-gutter-lg q-mb-md items-center">
        <div class="col-shrink">
          <q-btn
            round
            flat
            icon="chevron_left"
            :color="selectedDateIsToday ? 'grey-5' : 'black'"
            :disable="selectedDateIsToday"
            @click="addToDate(-1)"
          ></q-btn>
        </div>
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          mode="out-in"
          appear
          :duration="200"
        >
          <div :key="formattedDate" class="col-grow text-center text-subtitle1 text-weight-bold">
            {{ formattedDate }}
          </div>
        </transition>
        <div class="col-shrink text-right">
          <q-btn round flat icon="chevron_right" color="black" @click="addToDate(1)"></q-btn>
        </div>
      </div>
      <div class="row q-col-gutter-xs">
        <div class="text-weight-bold text-center" :class="`col-${colSize}`">Zeitraum</div>
        <div
          v-for="court in courts"
          :key="court.id"
          :class="`col-${colSize}`"
          class="text-weight-bold text-center"
        >
          {{ court.name }}
        </div>
        <div :class="`col-${colSize}`">
          <div class="column full-height items-center">
            <div class="col" v-for="slot in timeSlots" :key="slot.toString()">
              <div class="text-caption">
                {{ slot.from }} - {{ slot.to }}
              </div>
            </div>
          </div>
        </div>
        <div
          v-for="court in courtsWithSlots"
          :key="court.id"
          :class="`col-${colSize}`"
          class="text-center"
        >
          <div class="column q-col-gutter-xs">
              <div class="col" v-for="slot in court.timeSlots" :key="slot.toString()">
                <div
                  :class="slot.booking ? 'bg-red-5 text-white' : 'bg-grey-3'"
                  class="rounded-borders q-pa-xs"
                >
                  {{ slot.booking ? 'geblockt' : 'frei' }}
                </div>
              </div>
          </div>
        </div>
      </div>
    </loading-wrapper>
  </q-page>
</template>

<script setup lang="ts">
import { Booking, getBookings } from 'src/api/bookingApi';
import {
  ComputedRef,
  Ref, computed, onMounted, ref,
} from 'vue';
import { useRoute } from 'vue-router';
import LoadingWrapper from 'src/components/LoadingWrapper.vue';
import { extractISODate, toGermanWeekdayDate } from 'src/api/format';
import { date } from 'quasar';
import useNotify, { NotifyType } from 'src/hooks/useNotify';
import { BookableCourt, getBookableCourts } from '../api/bookableCourtApi';

interface TimeSlot {
  from: string;
  to: string;
  booking?: Booking;
}

interface CourtWithSlots extends BookableCourt {
  timeSlots: TimeSlot[]
}

const route = useRoute();
const { show } = useNotify();

const bookableTimeRange = [10, 22];

const courts: Ref<BookableCourt[]> = ref([]);
const bookings: Ref<Booking[]> = ref([]);
const loading: Ref<boolean> = ref(false);
const selectedDate: Ref<Date> = ref(new Date());

const courtsAmounts: ComputedRef<number> = computed(() => courts.value.length || 0);
const courtsWithSlots: ComputedRef<CourtWithSlots[]> = computed(() => courts.value.map((court) => {
  const slots = [];
  // const courtBookings = bookings.value.filter((booking) => booking.bookedCourt.id === court.id);
  for (let i = bookableTimeRange[0]; i <= bookableTimeRange[1]; i += 1) {
    if (i < bookableTimeRange[1]) {
      // if (courtBookings.length > 0){

      // }
      // const firstTime = `${i}:00`;
      // const middleTime = `${i}:30`;
      // const lastTime = `${i + 1}:00`;
      slots.push({
        from: `${i}:00`,
        to: `${i}:30`,
        booking: !!Math.round(Math.random()),
      });
      slots.push({
        from: `${i}:30`,
        to: `${i + 1}:00`,
        booking: !!Math.round(Math.random()),
      });
    }
  }
  return {
    ...court,
    timeSlots: slots,
  };
}));
const colSize: ComputedRef<number> = computed(() => {
  switch (courtsAmounts.value) {
    case 3:
      return 3;
    case 2:
      return 4;
    case 1:
      return 6;
    default:
      return 3;
  }
});
const id = computed(() => parseInt(route.params.id.toString(), 10));
const selectedDateIsToday = computed(
  () => date.isSameDate(extractISODate(selectedDate.value.toISOString()), new Date(), 'date'),
);
const formattedDate: ComputedRef<string> = computed(
  () => toGermanWeekdayDate(selectedDate.value.toISOString()),
);

const timeSlots: { from: string, to: string}[] = [];
for (let i = bookableTimeRange[0]; i <= bookableTimeRange[1]; i += 1) {
  if (i < bookableTimeRange[1]) {
    timeSlots.push({
      from: `${i}:00`,
      to: `${i}:30`,
    });
    timeSlots.push({
      from: `${i}:30`,
      to: `${i + 1}:00`,
    });
  }
}

// function isBookingInTimeSlot(from: Date, to: Date, booking: Booking) {

// }

async function loadBookingsForDate() {
  try {
    bookings.value = await getBookings(id.value, selectedDate.value);
  } catch (error) {
    console.log(error);
    show('Fehler beim Laden der Buchungen.', NotifyType.Error);
  }
}

function addToDate(sign: number) {
  selectedDate.value = date.addToDate(selectedDate.value, { days: 1 * sign });
  loadBookingsForDate();
}

onMounted(async () => {
  loading.value = true;
  courts.value = await getBookableCourts(id.value);
  await loadBookingsForDate();
  loading.value = false;
});
</script>
