<template>
  <q-page padding class="q-py-md">
    <div class="column">
      <q-img
        :src="team?.teamImage?.url"
        :ratio="16/9"
        fit="cover"
      ></q-img>
      <q-card
        v-if="team?.isRecruiting"
        class="q-mt-lg red-shadow relative"
        style="overflow: hidden;"
      >
        <q-card-section style="z-index: 1">
          <div class="text-h6 text-weight-bold text-primary">{{ team.recruitingTitle }}</div>
          <div v-if="team.recruitingText" class="q-mt-sm">{{ team.recruitingText }}</div>
        </q-card-section>
        <q-btn
          no-caps
          unelevated
          color="primary"
          class="full-width"
          style="z-index: 1"
          square
          @click="showContactDialog = true"
        >{{ team.recruitingButtonText }}</q-btn>
        <div class="absolute announcement-background">
          <img src="~/assets/attack.png" width="150">
        </div>
      </q-card>
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
    <q-dialog v-model="showContactDialog">
      <q-card class="full-width">
        <q-card-section class="q-dialog__title">
          Kontaktaufnahme
        </q-card-section>
        <q-card-section class="q-gutter-sm">
          <div class="text-weight-medium">Vorname<span class="text-red">*</span></div>
          <q-input
            v-model="contactFormular.firstname"
            dense
            outlined
            class="bg-white"
            clearable
          />
          <div class="text-weight-medium">Nachname<span class="text-red">*</span></div>
          <q-input
            v-model="contactFormular.lastname"
            dense
            outlined
            class="bg-white"
            clearable
          />
          <div class="text-weight-medium">Alter<span class="text-red">*</span></div>
          <q-input
            v-model="contactFormular.age"
            dense
            outlined
            class="bg-white"
            clearable
            type="number"
            min="12"
            max="99"
          />
          <div class="text-weight-medium">Position<span class="text-red">*</span></div>
          <q-select
            v-model="contactFormular.position"
            dense
            outlined
            :options="positionOptions"
            class="bg-white"
            clearable
          />
        </q-card-section>
        <q-card-actions class="row justify-end">
          <q-btn color="primary" flat @click="showContactDialog = false">Abbrechen</q-btn>
          <q-btn color="primary" :href="mailPreset" unelevated>Kontakt aufnehmen</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <bottom-action>
      <q-btn flat class="full-width">
        <q-icon name="ph-pencil-simple" class="q-mr-sm"/>
        Bearbeiten
      </q-btn>
    </bottom-action>
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
import BottomAction from 'src/components/BottomAction.vue';

const route = useRoute();
const teamStore = useTeamStore();

const dayMap = ['', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const slide = ref();
const showContactDialog = ref(false);
const contactFormular = ref({
  firstname: '',
  lastname: '',
  age: null,
  position: null,
});
const positionOptions = [
  'Diagonal',
  'Außenangreifer',
  'Zuspieler',
  'Mittelblocker',
  'Libero',
  'Trainer',
  'Co-Trainer',
];

const id = computed(() => Number.parseInt(route.params.id.toString(), 10));
const team = computed<Team | null>(() => teamStore.getTeam(id.value));
const mailPreset = computed<string>(() => {
  let mailLink = 'mailto:';
  mailLink += team.value?.recruitingEmail || '';
  mailLink += '?subject=Bock auf Hörde&body=Hallo,%0D%0A%0D%0A ich würde gerne mal bei Euch vorbeischauen. ';
  mailLink += `Mein Name ist ${contactFormular.value.firstname} ${contactFormular.value.lastname} und ich bin `;
  mailLink += `${contactFormular.value.age} Jahre alt. In meiner bisheringe Laufbahn war ich `;
  mailLink += `${contactFormular.value.position}.`;
  mailLink += `%0D%0A%0D%0A${contactFormular.value.firstname} ${contactFormular.value.lastname}`;
  return mailLink;
});
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

<style>
.red-shadow {
  box-shadow: rgba(227, 30, 36, 0.2) 0px 7px 29px 0px;
  /* box-shadow: rgba(227, 30, 36, 0.25) 0px 54px 55px,
   rgba(227, 30, 36, 0.12) 0px -12px 30px, rgba(227, 30, 36, 0.12) 0px 4px 6px,
    rgba(227, 30, 36, 0.17) 0px 12px 13px, rgba(227, 30, 36, 0.09) 0px -3px 5px; */
}

.announcement-background {
  right: -35px; bottom: 5px; z-index: 0; opacity: 0.08;
}
</style>
