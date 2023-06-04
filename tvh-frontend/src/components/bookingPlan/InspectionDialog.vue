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
        </div>
      </q-card-section>
      <q-card-actions class="row justify-end">
        <q-btn
        v-if="booking?.bookedBy?.id === userId"
        color="primary"
        flat
        @click="doDeleteBooking"
        >Löschen</q-btn>
        <q-btn
        v-else
        color="primary"
        flat
        @click="close"
        >Anfrage</q-btn>
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
import { ref } from 'vue';
import { ENGINE_METHOD_STORE } from 'constants';

interface Props {
  booking: Booking | null;
}

const props = defineProps<Props>();
const emits = defineEmits(['update:model-value', 'deleted']);

const { show } = useNotify();
const { log } = useLog();
const { checkApproval } = useApprovalDialog();
const authStore = useAuthStore();

const { userId } = storeToRefs(authStore);
const loading = ref(false);

function close() {
  emits('update:model-value', false);
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
