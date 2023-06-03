<template>
  <q-page>
    <q-list v-if="events.length > 0">
      <template v-for="event in events" :key="event.header">
        <q-item-label header>{{ event.header }}</q-item-label>
        <q-item v-for="happening in event.events" :key="happening.id" class="q-mb-md">
          <q-item-section>
            <q-item-label class="text-weight-bolder">
              {{ dateToHourMinute(happening.date) }}
            </q-item-label>
            <q-item-label>{{ happening.name }}</q-item-label>
            <q-item-label>
              <place-link :place="happening.place" />
            </q-item-label>
          </q-item-section>

          <q-item-section side v-if="isCapacitor">
            <q-btn
              v-if="!happening.disabled"
              :icon="happening.isActive ? 'ph-bell-slash' : 'ph-bell-ringing'"
              :color="happening.isActive ? '' : 'primary'"
              round
              flat
              @click="toggleActiveEvent(happening)"
            ></q-btn>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
    <div class="flex flex-center full-height q-mt-md" v-else>
      Keine Termine gefunden.
    </div>
    <bottom-action v-if="canEditEvent">
      <q-btn flat class="full-width" to="/event-editor/new">
        <q-icon name="ph-plus" class="q-mr-sm"></q-icon>Neues Event
      </q-btn>
    </bottom-action>
  </q-page>
</template>

<script setup lang="ts">
import { useEventStore } from 'src/stores/eventStore';
import { computed, onMounted } from 'vue';
import { date, useQuasar } from 'quasar';
import PlaceLink from 'src/components/PlaceLink.vue';
import BottomAction from 'src/components/BottomAction.vue';
import { useCanDo } from 'src/hooks/useCanDo';

import { Event } from 'src/api/eventApi';
import { dateToHourMinute } from '../api/format';

interface ActivatableEvent extends Event {
  isActive: boolean;
}

// stores
const eventStore = useEventStore();
const { canEditEvent } = useCanDo();
const $q = useQuasar();
const isCapacitor = $q.platform.is.capacitor;

// computed
const sortedEvents = computed(() => eventStore.sortByDate);
const notifications = computed(() => eventStore.notifications);
const events = computed(() => Object.keys(sortedEvents.value).map((key) => ({
  header: date.isSameDate(
    new Date(),
    date.extractDate(key, 'DD.MM.YYYY'),
    'date',
  ) ? 'Heute' : key,
  events: sortedEvents.value[key].map((happening: any) => ({
    ...happening,
    isActive: !!notifications.value.find((notify) => notify.event.id === happening.id),
    disabled: date.getDateDiff(happening.date, new Date(), 'minutes') < 60,
  })),
})));

// functions
async function toggleActiveEvent(happening: ActivatableEvent) {
  if (happening.isActive) {
    eventStore.cancelNotification(happening);
  } else {
    eventStore.setSchedule(happening);
  }
}

onMounted(() => {
  eventStore.fetchEvents();
  console.log(events.value);
});
</script>
