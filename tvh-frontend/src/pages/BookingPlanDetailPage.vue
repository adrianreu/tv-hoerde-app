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
      <q-dialog v-model="showInspectDialog">
        <q-card class="full-width">
          <q-card-section class="q-dialog__title">
            Buchung ansehen
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <div class="text-weight-bold">
                  Datum
                </div>
                <div>
                  {{ date.formatDate(new Date(selectedBooking?.startTime || ''), 'DD.MM.YYYY') }}
                </div>
              </div>
              <div class="col-6">
                <div class="text-weight-bold">
                  Feld
                </div>
                <div>
                  {{ selectedBooking?.bookedCourt?.id }}
                </div>
              </div>
              <div class="col-6">
                <div class="text-weight-bold">
                  Zeitraum
                </div>
                <div>
                  {{ date.formatDate(new Date(selectedBooking?.startTime || ''), 'HH:mm') }} -
                  {{ date.formatDate(new Date(selectedBooking?.endTime || ''), 'HH:mm') }}
                </div>
              </div>
              <div class="col-6">
                <div class="text-weight-bold">
                  Gebucht von
                </div>
                <div>
                  {{ selectedBooking?.bookedBy?.firstname }}
                  {{ selectedBooking?.bookedBy?.lastname }}
                </div>
              </div>
            </div>
          </q-card-section>
          <q-card-actions class="row justify-end">
            <q-btn
            v-if="selectedBooking?.bookedBy?.id === userId"
            color="primary"
            flat
            @click="doDeleteBooking"
            >Löschen</q-btn>
            <q-btn
            v-else
            color="primary"
            flat
            @click="showInspectDialog = false"
            >Antrag auf Änderung</q-btn>
            <q-btn color="primary" flat @click="showInspectDialog = false">Schliessen</q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
      <q-dialog v-model="showBookingDialog">
        <q-card class="full-width">
          <q-card-section class="q-dialog__title">
            Buchung anlegen
          </q-card-section>
          <q-card-section class="q-gutter-sm">
            <div class="text-weight-medium">
              Datum
            </div>
            <q-input
              :model-value="formattedDate"
              dense
              outlined
              class="bg-white"
              clearable
              clear-icon="ph-x-circle"
              disable
            />
            <div class="text-weight-medium q-mt-md">
              Feld
            </div>
            <q-select
              v-model="selectedCourt"
              dense
              outlined
              :options="courts"
              class="bg-white"
              clearable
              clear-icon="ph-x-circle"
              emit-value
              map-options
              option-label="name"
              option-value="id"
              dropdown-icon="ph-caret-down"
            />
            <div class="text-weight-medium q-mt-md">
              Startzeit<span class="text-red">*</span>
            </div>
            <q-select
              v-model="selectedStartTime"
              dense
              outlined
              :options="startTimeOptions"
              class="bg-white"
              clearable
              clear-icon="ph-x-circle"
              emit-value
              dropdown-icon="ph-caret-down"
              map-options
            />
            <div class="text-weight-medium q-mt-md">
              Endzeit<span class="text-red">*</span>
            </div>
            <q-select
              v-model="selectedEndTime"
              dense
              outlined
              :options="endTimeOptions"
              class="bg-white"
              clearable
              clear-icon="ph-x-circle"
              dropdown-icon="ph-caret-down"
              emit-value
              map-options
              :disable="selectedStartTime === null"
            />
            <div class="text-weight-medium q-mt-md">
              Anzahl Personen<span class="text-red">*</span>
            </div>
            <q-input
              v-model="amountPersons"
              placeholder="Anzahl Personen"
              type="number"
              dense
              outlined
              class="bg-white"
              :min="2"
              :max="20"
            ></q-input>
          </q-card-section>
          <q-card-actions class="row justify-end">
            <q-btn color="primary" flat @click="resetForm">Abbrechen</q-btn>
            <q-btn color="primary" flat @click="bookCourt">Buchen</q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </loading-wrapper>
  </q-page>
</template>

<script setup lang="ts">
import {
  Booking,
  createBooking,
  deleteBooking,
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
import { useAuthStore } from 'src/stores/authStore';
import { storeToRefs } from 'pinia';
import useLog from 'src/hooks/useLog';
import useApprovalDialog from 'src/hooks/useDeleteDialog';
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
const { checkApproval } = useApprovalDialog();
const authStore = useAuthStore();

const bookableTimeRange = [10, 22];

// refs
const { user, userId } = storeToRefs(authStore);
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
const amountPersons: Ref<number> = ref(2);
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
  const slots: TimeSlot[] = structuredClone(timeSlots.value);
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
const startTimeOptions: ComputedRef<{ label: string, value: Date }[]> = computed(() => {
  const options: { label: string, value: Date }[] = [];
  const courtWithSlots = courtsWithSlots.value.find((court) => court.id === selectedCourt.value);
  const filteredSlots = courtWithSlots?.timeSlots.filter((slot) => !slot.booking)
    || timeSlots.value;
  filteredSlots.forEach((slot, index) => {
    options.push({ label: date.formatDate(slot.from, 'HH:mm'), value: slot.from });
    if (index === filteredSlots.length - 1) {
      options.push({ label: date.formatDate(slot.to, 'HH:mm'), value: slot.to });
    }
  });
  return options;
});

const endTimeOptions: ComputedRef<{ label: string, value: Date }[]> = computed(() => {
  if (selectedEndTime.value === null) return startTimeOptions.value;
  const options: { label: string, value: Date }[] = [];
  const courtWithSlots = courtsWithSlots.value.find((court) => court.id === selectedCourt.value);
  const filteredSlots = courtWithSlots?.timeSlots || timeSlots.value;

  for (let i = 0; i < filteredSlots.length; i += 1) {
    const slot = filteredSlots[i];
    const dateDifference = date.getDateDiff(slot.from, selectedStartTime.value || '', 'minutes');
    if (dateDifference > 0) {
      options.push({ label: date.formatDate(slot.from, 'HH:mm'), value: slot.from });
      if (slot.booking) {
        break;
      }
    }
  }
  return options;
});

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
    console.log(selectedBooking.value);
    return;
  }
  if (courtId) {
    selectedCourt.value = courtId;
  }
  if (timeSlot) {
    selectedStartTime.value = timeSlot.from;
    selectedEndTime.value = timeSlot.to;
  }
  showBookingDialog.value = true;
}

function resetForm() {
  showBookingDialog.value = false;
  selectedStartTime.value = null;
  selectedCourt.value = null;
  selectedEndTime.value = null;
}

async function bookCourt() {
  if (
    !user.value?.id || !selectedStartTime.value || !selectedEndTime.value || !selectedCourt.value
  ) {
    show(
      'Es fehlen Informationen um eine Buchung durchzuführen.',
      NotifyType.Error,
    );
    return;
  }
  try {
    loading.value = true;
    const booking = await createBooking({
      bookedBy: user.value.id,
      startTime: selectedStartTime.value,
      endTime: selectedEndTime.value,
      bookedCourt: selectedCourt.value,
    });
    bookings.value.push(booking);
    show('Buchung erstellt.', NotifyType.Success);
    showBookingDialog.value = false;
  } catch (error) {
    log('bookCourt()', error);
    show(
      'Leider ist ein Fehler bei der Buchung aufgetreten. Bitte versuche es erneut.',
      NotifyType.Error,
    );
  } finally {
    loading.value = false;
  }
}

async function doDeleteBooking() {
  const approved = await checkApproval('Sicher, dass du die Buchung löschen möchtest?');
  const selectedBookingId = selectedBooking.value?.id;
  if (approved && selectedBookingId) {
    try {
      loading.value = true;
      await deleteBooking(selectedBookingId);
      bookings.value = bookings.value.filter((booking) => booking.id !== selectedBookingId);
      show('Buchung gelöscht.', NotifyType.Success);
      showInspectDialog.value = false;
    } catch (error) {
      log('BookingPlanDetailPage - doDeleteBooking', error);
      show(
        'Leider ist ein Fehler bei der Löschung aufgetreten. Bitte versuche es erneut.',
        NotifyType.Error,
      );
    } finally {
      loading.value = false;
    }
    return;
  }
  console.log('noz pproved');
  // TODO delete booking
}

function addToDate(sign: number) {
  selectedDate.value = date.addToDate(selectedDate.value, { days: 1 * sign });
  loadBookingsForDate();
}

onMounted(async () => {
  loading.value = true;
  courts.value = await getBookableCourts(id.value);
  selectedCourt.value = courts.value[0].id;
  await loadBookingsForDate();
  loading.value = false;
});
</script>
