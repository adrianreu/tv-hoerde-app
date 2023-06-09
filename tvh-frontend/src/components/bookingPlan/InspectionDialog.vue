<template>
  <q-dialog component="InspectionDialog">
    <q-card class="full-width">
      <q-inner-loading :visible="loading">
        <div class="column">
          <spinning-volleyball></spinning-volleyball>
          Lädt ...
        </div>
      </q-inner-loading>
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
              {{ date.formatDate(new Date(booking?.startTime || ''), 'DD.MM.YYYY') }}
            </div>
          </div>
          <div class="col-6">
            <div class="text-weight-bold">
              Feld
            </div>
            <div>
              {{ booking?.bookedCourt?.id }}
            </div>
          </div>
          <div class="col-6">
            <div class="text-weight-bold">
              Zeitraum
            </div>
            <div>
              {{ date.formatDate(new Date(booking?.startTime || ''), 'HH:mm') }} -
              {{ date.formatDate(new Date(booking?.endTime || ''), 'HH:mm') }}
            </div>
          </div>
          <div class="col-6">
            <div class="text-weight-bold">
              Gebucht von
            </div>
            <div>
              {{ booking?.bookedBy?.firstname }}
              {{ booking?.bookedBy?.lastname }}
            </div>
          </div>
          <div class="col-12" v-if="booking?.bookedBy?.id !== userId">
            <q-expansion-item
              v-model="expanded"
              icon="ph-swap"
              expand-icon="ph-caret-down"
              expanded-icon="ph-caret-up"
              label="Anfrage auf Übernahme"
              class="overflow-hidden rounded-borders q-mt-md"
              :class="{ 'shadow-1': expanded }"
              header-class="bg-accent text-white"
              expand-icon-class="text-white"
            >
              <q-card class="rounded-borders">
                <q-card-section>
                  <div class="text-weight-medium">
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
                    Nachricht<span class="text-red">*</span>
                  </div>
                  <q-input
                    v-model="message"
                    dense
                    type="textarea"
                    outlined
                    class="bg-white"
                    clearable
                    clear-icon="ph-x-circle"
                  />
                </q-card-section>
                <q-btn
                  class="full-width"
                  unelevated
                  color="primary"
                  square
                  @click="sendChangeRequest"
                >Anfrage absenden</q-btn>
              </q-card>
            </q-expansion-item>
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="row justify-end">
        <q-btn
          v-if="booking?.bookedBy?.id === userId"
          color="primary"
          flat
          @click="doDeleteBooking"
        >Löschen</q-btn>

        <q-btn color="primary" flat @click="close">Schliessen</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Booking, deleteBooking } from 'src/api/bookingApi';
import { useAuthStore } from 'src/stores/authStore';
import SpinningVolleyball from 'src/components/SpinningVolleyball.vue';
import { date } from 'quasar';
import useApprovalDialog from 'src/hooks/useDeleteDialog';
import useLog from 'src/hooks/useLog';
import useNotify, { NotifyType } from 'src/hooks/useNotify';
import {
  ComputedRef, Ref, computed, ref,
} from 'vue';
import useBookingTimeSlots from 'src/hooks/useBookingTimeSlots';
import { createChangeRequest } from 'src/api/changeRequestApi';

interface Props {
  booking: Booking | null;
}

const props = defineProps<Props>();
const emits = defineEmits(['update:model-value', 'deleted']);

const { show } = useNotify();
const { log } = useLog();
const { checkApproval } = useApprovalDialog();
const { timeSlots } = useBookingTimeSlots();
const authStore = useAuthStore();

const { userId } = storeToRefs(authStore);
const loading = ref(false);
const expanded = ref(false);
const message = ref('');
const selectedStartTime: Ref<Date | null> = ref(null);
const selectedEndTime: Ref<Date | null> = ref(null);

function close() {
  emits('update:model-value', false);
}

const startTimeOptions: ComputedRef<({ label: string, value: Date })[]> = computed(
  () => timeSlots.value
    .filter((slot) => (slot.from >= (new Date(props.booking?.startTime || ''))
      && slot.to < new Date(props.booking?.endTime || '')))
    .map((slot) => ({ label: date.formatDate(slot.to, 'HH:mm'), value: slot.from })),
);

const endTimeOptions: ComputedRef<{ label: string, value: Date }[]> = computed(
  () => timeSlots.value
    .filter((slot) => (slot.from > (selectedStartTime.value || new Date(props.booking?.startTime || ''))
      && slot.to <= new Date(props.booking?.endTime || '')))
    .map((slot) => ({ label: date.formatDate(slot.to, 'HH:mm'), value: slot.to })),
);

async function sendChangeRequest() {
  // TODO add form validation
  if (
    selectedEndTime.value === null
    || selectedStartTime.value === null
    || props.booking?.id === undefined
  ) {
    return;
  }
  try {
    loading.value = true;
    await createChangeRequest({
      from: selectedStartTime.value,
      to: selectedEndTime.value,
      message: message.value,
      booking: props.booking?.id,
      requestedBy: userId.value,
    });
    show('Anfrage abgesendet.', NotifyType.Success);
    close();
  } catch (error) {
    log('InspectionDialog - sendChangeRequest', error);
    show(
      'Leider ist ein Fehler beim Absenden der Anfrage aufgetreten. Bitte versuche es erneut.',
      NotifyType.Error,
    );
  } finally {
    loading.value = false;
  }
}

async function doDeleteBooking() {
  const approved = await checkApproval('Sicher, dass du die Buchung löschen möchtest?');
  const selectedBookingId = props.booking?.id;
  if (approved && selectedBookingId) {
    try {
      loading.value = true;
      await deleteBooking(selectedBookingId);
      show('Buchung gelöscht.', NotifyType.Success);
      emits('deleted', selectedBookingId);
      close();
    } catch (error) {
      log('BookingPlanDetailPage - doDeleteBooking', error);
      show(
        'Leider ist ein Fehler bei der Löschung aufgetreten. Bitte versuche es erneut.',
        NotifyType.Error,
      );
    } finally {
      loading.value = false;
    }
  }
}
</script>
