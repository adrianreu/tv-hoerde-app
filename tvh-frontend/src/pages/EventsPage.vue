<template>
  <q-page>
    <q-list>
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

          <q-item-section side>
            <q-btn
              :icon="happening.isActive ? 'notifications_off' : 'notifications_active'"
              round
              flat
              @click="toggleActiveEvent(happening.id)"
            ></q-btn>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
    <bottom-action>
      <q-btn flat class="full-width" icon="add" to="/event-editor/new">Neues Event</q-btn>
    </bottom-action>
  </q-page>
</template>

<script setup lang="ts">
import { useEventStore } from 'src/stores/eventStore';
import { computed, onMounted, ref } from 'vue';
import { date } from 'quasar';
import PlaceLink from 'src/components/PlaceLink.vue';
import BottomAction from 'src/components/BottomAction.vue';
import { dateToHourMinute } from '../api/format';

// stores
const eventStore = useEventStore();

// refs
const activeEvents = ref<number[]>([]);

// computed
const sortedEvents = computed(() => eventStore.sortByDate);
const events = computed(() => Object.keys(sortedEvents.value).map((key) => ({
  header: date.isSameDate(
    new Date(),
    date.extractDate(key, 'DD.MM.YYYY'),
    'date',
  ) ? 'Heute' : key,
  events: sortedEvents.value[key].map((happening: any) => ({
    ...happening,
    isActive: !!activeEvents.value.find((id) => id === happening.id),
  })),
})));

// functions
function toggleActiveEvent(id: number) {
  const index = activeEvents.value.indexOf(id);
  if (index >= 0) {
    activeEvents.value.splice(index, 1);
  } else {
    activeEvents.value.push(id);
  }
}

onMounted(() => {
  eventStore.fetchEvents();
  console.log(events.value);
});
</script>
