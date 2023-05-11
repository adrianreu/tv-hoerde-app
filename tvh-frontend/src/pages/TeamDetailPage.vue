<template>
  <q-page padding class="q-py-md">
    <div class="column">
      <q-img
        :src="team?.teamImage?.url"
        :ratio="16/9"
        fit="cover"
      ></q-img>
      <div class="text-h6 q-mt-lg q-mb-sm">Aufstellung</div>
      <q-carousel
        v-if="teamMembers.length > 0"
        v-model="slide"
        transition-prev="jump-right"
        transition-next="jump-left"
        swipeable
        animated
        control-color="white"
        color="accent"
        :navigation="teamMembers?.length > 1"
        arrows
        class="bg-accent text-white shadow-1 rounded-borders q-mb-md"
      >
        <q-carousel-slide
          v-for="member in teamMembers"
          :key="member.id"
          :name="member.id"
          class="q-pa-none"
        >
          <div>
            {{ member.firstname }}
            {{ member.lastname }}
          </div>
          <q-img
            :src="member.image.url"
            fit="contain"
            :ratio="4/3"
            class="col-12 full-height"
          ></q-img>
        </q-carousel-slide>
      </q-carousel>
      <div class="text-h6 q-mt-lg q-mb-sm">Trainingszeiten</div>
      <div class="row q-col-gutter-md items-center">
        <template v-for="trainingTime in trainingTimes" :key="trainingTime.id">
          <div class="col-6">
            <div class="text-weight-bold">{{ trainingTime.dayOfWeek }}</div>
            <div>{{ trainingTime.from }} - {{  trainingTime.to }} Uhr</div>
          </div>
          <div class="col-6 text-right text-underline text-subtitle1">
            <place-link :place="trainingTime.place"> </place-link>
          </div>
        </template>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { timeToHourMinute } from 'src/api/format';
import { Team } from 'src/api/teamApi';
import { TeamMember } from 'src/api/teamMemberApi';
import PlaceLink from 'src/components/PlaceLink.vue';
import { useTeamStore } from 'src/stores/teamStore';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const teamStore = useTeamStore();

const id = computed(() => Number.parseInt(route.params.id.toString(), 10));
const team = computed<Team | null>(() => teamStore.getTeam(id.value));
const slide = ref();
const dayMap = ['', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const teamMembers = computed<TeamMember[]>(() => team.value?.teamMembers || []);

const trainingTimes = computed(() => team.value?.trainingTimes?.map((training) => ({
  ...training,
  from: timeToHourMinute(training.from),
  to: timeToHourMinute(training.to),
  dayOfWeek: dayMap[training.dayOfWeek],
  googleTerm: `${training?.place?.street} ${training.place?.houseNumber} ${training.place?.zipCode} ${training.place?.city}`,
})) || []);

onMounted(() => {
  teamStore.fetchTeam(id.value);
});
</script>
