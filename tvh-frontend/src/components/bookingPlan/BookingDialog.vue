<template>
  <q-dialog>
    <q-inner-loading :visible="loading">
      <div class="column">
        <spinning-volleyball></spinning-volleyball>
        Lädt ...
      </div>
    </q-inner-loading>
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
          :model-value="courtId"
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
          @update:model-value="emits('update:court-id', $event)"
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
      </q-card-section>
      <q-card-actions class="row justify-end">
        <q-btn color="primary" flat @click="resetForm">Abbrechen</q-btn>
        <q-btn color="primary" flat @click="bookCourt">Buchen</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  Booking,
  createBooking,
} from 'src/api/bookingApi';
import {
  ComputedRef,
  Ref, computed, ref,
} from 'vue';
import { toGermanWeekdayDate } from 'src/api/format';
import { date } from 'quasar';
import useNotify, { NotifyType } from 'src/hooks/useNotify';
import { useAuthStore } from 'src/stores/authStore';
import { storeToRefs } from 'pinia';
import useLog from 'src/hooks/useLog';
import { BookableCourt } from '../../api/bookableCourtApi';

interface TimeSlot {
  from: Date;
  to: Date;
  label: string;
  booking?: Booking;
}

interface CourtWithSlots extends BookableCourt {
  timeSlots: TimeSlot[]
}

interface Props {
  courtWithSlots: CourtWithSlots | null;
  courtId: number | null;
}

const props = defineProps<Props>();
const emits = defineEmits(['update:model-value', 'update:court-id', 'booked']);

const { show } = useNotify();
const { log } = useLog();
const authStore = useAuthStore();

const bookableTimeRange = [10, 22];

// refs
const { user } = storeToRefs(authStore);
const courts: Ref<BookableCourt[]> = ref([]);
const loading: Ref<boolean> = ref(false);
const selectedDate: Ref<Date> = ref(new Date());

// form
const selectedStartTime: Ref<Date | null> = ref(null);
const selectedEndTime: Ref<Date | null> = ref(null);
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
const startTimeOptions: ComputedRef<{ label: string, value: Date }[]> = computed(() => {
  const options: { label: string, value: Date }[] = [];
  const filteredSlots = props.courtWithSlots?.timeSlots.filter((slot) => !slot.booking)
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
  const filteredSlots = props.courtWithSlots?.timeSlots || timeSlots.value;

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

const formattedDate: ComputedRef<string> = computed(
  () => toGermanWeekdayDate(selectedDate.value.toISOString()),
);

function resetForm() {
  emits('update:model-value', false);
  selectedStartTime.value = null;
  selectedEndTime.value = null;
}

async function bookCourt() {
  if (
    !user.value?.id || !selectedStartTime.value || !selectedEndTime.value || !props.courtId
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
      bookedCourt: props.courtId,
    });
    show('Buchung erstellt.', NotifyType.Success);
    emits('booked', booking);
    emits('update:model-value', false);
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
</script>
