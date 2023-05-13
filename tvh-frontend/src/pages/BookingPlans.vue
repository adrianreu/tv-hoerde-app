<template>
  <q-page>
    <loading-wrapper :loading="loading">
      <q-list separator>
        <q-separator/>
        <q-item
          clickable
          v-ripple
          v-for="team in teamStore.getTeams"
          :key="team.id"
          @click="goToDetailPage(team)"
        >
          <q-item-section avatar v-if="team.teamImage">
            <q-avatar fit="contain" rounded>
              <q-img :src="team.teamImage?.formats.small.url"></q-img>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label v-if="team.league" caption>{{ team.league }}</q-item-label>
            <q-item-label>{{ team.name }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>
        <q-separator/>
      </q-list>
    </loading-wrapper>
    <bottom-action>
      <q-btn flat class="full-width" icon="add">Neues Team</q-btn>
    </bottom-action>
  </q-page>
</template>

<script setup lang="ts">
import { useEventStore } from 'src/stores/eventStore';
import { computed, onMounted, ref } from 'vue';
import { date } from 'quasar';
import LoadingWrapper from 'src/components/LoadingWrapper.vue';
import BottomAction from 'src/components/BottomAction.vue';

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
