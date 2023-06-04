<template>
  <q-page padding>
    <loading-wrapper :loading="loading">
      <div class="row q-col-gutter-lg q-mb-md items-center">
        <div class="col-shrink">
          <q-btn
            round
            flat
            icon="ph-caret-left"
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
          <q-btn round flat icon="ph-caret-right" color="black" @click="addToDate(1)"></q-btn>
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
          <div class="column q-col-gutter-xs">
            <div class="col" v-for="slot in timeSlots" :key="slot.toString()">
              <div class="relative-position q-pa-xs text-transparent">
                hold
                <div
                  class="
                    absolute text-caption text-center text-accent full-height full-width q-py-xs
                  "
                  style="top:0; left:0;"
                >
                  {{ slot.label }}
                </div>
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
                  :class="slot.booking ? 'bg-red-2 text-black' : 'bg-grey-3'"
                  class="rounded-borders q-pa-xs"
                  @click="openBookingDialog(court.id, slot)"
                >
                  {{ slot.booking ? 'belegt' : 'frei' }}
                </div>
              </div>
          </div>
        </div>
      </div>
      <bottom-action>
        <q-btn flat class="full-width" @click="$event => openBookingDialog()">
          <q-icon name="ph-volleyball" class="q-mr-sm"/>
          Buchung anlegen
        </q-btn>
      </bottom-action>

      <inspection-dialog
        v-model="showInspectDialog"
        :booking="selectedBooking"
        @deleted="removeBooking"
      />

      <booking-dialog
        v-model="showBookingDialog"
        v-model:court-id="selectedCourt"
        :court-with-slots="selectedCourtWithSlots"
        @booked="(booking) => bookings.push(booking)"
      />
    </loading-wrapper>
  </q-page>
</template>

<script setup lang="ts">
import {
  Booking,
  getBookings,
} from 'src/api/bookingApi';
import {
  ComputedRef,
  Ref, computed, onMounted, ref,
} from 'vue';
import { useRoute } from 'vue-router';
import LoadingWrapper from 'src/components/LoadingWrapper.vue';
import { extractISODate, toGermanWeekdayDate } from 'src/api/format';
import { date } from 'quasar';
import useNotify, { NotifyType } from 'src/hooks/useNotify';
import BottomAction from 'src/components/BottomAction.vue';
import useLog from 'src/hooks/useLog';
import InspectionDialog from 'src/components/bookingPlan/InspectionDialog.vue';
import BookingDialog from 'src/components/bookingPlan/BookingDialog.vue';
import { BookableCourt, getBookableCourts } from '../api/bookableCourtApi';

interface TimeSlot {
  from: Date;
  to: Date;
  label: string;
  booking?: Booking;
}

interface CourtWithSlots extends BookableCourt {
  timeSlots: TimeSlot[]
}

const route = useRoute();
const { show } = useNotify();
const { log } = useLog();

const bookableTimeRange = [10, 22];

// refs
const courts: Ref<BookableCourt[]> = ref([]);
const bookings: Ref<Booking[]> = ref([]);
const loading: Ref<boolean> = ref(false);
const selectedDate: Ref<Date> = ref(new Date());
const showBookingDialog: Ref<boolean> = ref(false);
const showInspectDialog: Ref<boolean> = ref(false);

// form
const selectedStartTime: Ref<Date | null> = ref(null);
const selectedEndTime: Ref<Date | null> = ref(null);
const selectedCourt: Ref<number | null> = ref(null);
const selectedBooking: Ref<Booking | null> = ref(null);

const courtsAmounts: ComputedRef<number> = computed(() => courts.value.length || 0);
const timeSlots: ComputedRef<TimeSlot[]> = computed(() => {
  const slots = [];
  for (let i = bookableTimeRange[0]; i <= bookableTimeRange[1]; i += 1) {
    if (i < bookableTimeRange[1]) {
      const firstTime = date.adjustDate(selectedDate.value, {
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
        booking: undefined,
      });
      slots.push({
        from: middleTime,
        to: lastTime,
        label: `${i}:30 - ${i + 1}:00`,
        booking: undefined,
      });
    }
  }
  return slots;
});
const courtsWithSlots: ComputedRef<CourtWithSlots[]> = computed(() => courts.value.map((court) => {
  const slots: TimeSlot[] = typeof structuredClone !== 'undefined'
    ? structuredClone(timeSlots.value)
    : JSON.parse(JSON.stringify(timeSlots.value));
  const courtBookings = bookings.value.filter((booking) => booking.bookedCourt.id === court.id);
  courtBookings.forEach((booking) => {
    const startTime = extractISODate(booking.startTime);
    const endTime = extractISODate(booking.endTime);
    let started = false;
    for (let i = 0; i < slots.length; i += 1) {
      const slot = slots[i];
      if (
        !started
        && date.isBetweenDates(date.addToDate(startTime, { minute: 1 }), slot.from, slot.to)
      ) {
        started = true;
      }
      if (started) {
        slot.booking = booking;
      }
      if (date.isBetweenDates(date.subtractFromDate(endTime, { minute: 1 }), slot.from, slot.to)) {
        break;
      }
    }
  });
  return {
    ...court,
    timeSlots: [...slots],
  };
}));
const selectedCourtWithSlots = computed(
  () => courtsWithSlots.value.find((court) => court.id === selectedCourt.value) || null,
);

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

async function loadBookingsForDate() {
  try {
    bookings.value = await getBookings(id.value, selectedDate.value);
  } catch (error) {
    log('loadBookingsForDate()', error);
    show('Fehler beim Laden der Buchungen.', NotifyType.Error);
  }
}

function openBookingDialog(courtId?: number, timeSlot?: TimeSlot) {
  if (timeSlot?.booking) {
    showInspectDialog.value = true;
    selectedBooking.value = timeSlot.booking;
    return;
  }
  if (courtId) {
    selectedCourt.value = courtId;
  } else {
    selectedCourt.value = courts.value[0].id;
  }
  if (timeSlot) {
    selectedStartTime.value = timeSlot.from;
    selectedEndTime.value = timeSlot.to;
  }
  showBookingDialog.value = true;
}

function removeBooking(bookingId: number) {
  bookings.value = bookings.value.filter((booking) => booking.id !== bookingId);
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
