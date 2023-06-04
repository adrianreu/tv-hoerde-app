<template>
   <q-dialog component="RequestDialog">
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
        @click="close"
        >Anfrage</q-btn>
        <q-btn color="primary" flat @click="close">Schliessen</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { Booking } from 'src/api/bookingApi';

interface Props {
  booking: Booking;
}

defineProps<Props>();
const emits = defineEmits(['update:model-value']);

function close() {
  emits('update:model-value', false);
}
</script>
