<template>
  <q-page padding>
    <div class="q-gutter-sm">
      <div class="text-weight-bold">Name<span class="text-red">*</span></div>
      <q-input
        v-model="team.name"
        placeholder="Titel"
        dense
        outlined
        class="bg-white"
      ></q-input>

      <div class="text-weight-bold q-mt-md">Liga<span class="text-red">*</span></div>
      <q-input
        v-model="team.league"
        placeholder="Liga"
        dense
        outlined
        class="bg-white"
      />
      <div class="text-weight-bold q-mt-md">Aufstellung<span class="text-red">*</span></div>
      <q-list separator>
        <q-separator/>
        <q-item
          v-for="member in team?.teamMembers"
          :key="member.id"
          class="q-px-none"
        >
          <q-item-section avatar>
            <q-img
              :src="member.image.url"
              fit="cover"
              :ratio="1"
              class="rounded-borders"
              style="width: 40px; height: 40px;"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="ellipsis">
              {{ member.firstname }} {{  member.lastname }}
            </q-item-label>
            <q-item-label caption>
              {{ member.position }}
            </q-item-label>
          </q-item-section>
          <q-item-section class="col-4" avatar>
            <div class="row">
              <q-btn round flat icon="ph-pencil" dense></q-btn>
              <q-btn round flat icon="ph-trash" dense></q-btn>
            </div>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple class="text-primary">
          <q-item-section class="row items-center">
            <q-item-label>
              <q-avatar size="lg">
                <q-icon name="ph-plus" size="sm"></q-icon>
              </q-avatar>
              Neuen Spieler anlegen
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator/>
      </q-list>
      <div class="text-weight-bold q-mt-md">Trainingszeiten<span class="text-red">*</span></div>
      <q-list separator>
        <q-separator/>
        <q-item
          v-for="trainingTime in trainingTimes"
          :key="trainingTime.id"
          class="q-px-none"
        >
          <q-item-section>
            <q-item-label>
              {{ trainingTime.dayOfWeek }} {{ trainingTime.from }} - {{  trainingTime.to }} Uhr
            </q-item-label>
            <q-item-label v-if="trainingTime.place.name" caption>
              {{ trainingTime.place.name }}
            </q-item-label>
          </q-item-section>
          <q-item-section class="col-4" avatar>
            <div class="row">
              <q-btn round flat icon="ph-pencil" dense></q-btn>
              <q-btn round flat icon="ph-trash" dense></q-btn>
            </div>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple class="text-primary">
          <q-item-section class="row items-center">
            <q-item-label>
              <q-avatar size="lg">
                <q-icon name="ph-plus" size="sm"></q-icon>
              </q-avatar>
              Neue Trainingszeit anlegen
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-separator/>
      </q-list>
      <div class="text-weight-bold q-mt-md">Rekrutierung<span class="text-red">*</span></div>
      <q-checkbox
        v-model="team.isRecruiting"
        style="margin-left: 0px"
      >Rekrutierungsbanner aktivieren</q-checkbox>
      <div class="text-weight-bold q-mt-md">Rekrutierungstitel<span class="text-red">*</span></div>
      <q-input
        v-model="team.recruitingTitle"
        placeholder="Rekrutierungstitel"
        dense
        outlined
        class="bg-white"
      ></q-input>
      <div class="text-weight-bold q-mt-md">
        Rekrutierungstext<span class="text-red">*</span>
      </div>
      <q-input
        v-model="team.recruitingText"
        placeholder="Rekrutierungstext"
        type="textarea"
        dense
        outlined
        class="bg-white"
      ></q-input>
      <div class="text-weight-bold q-mt-md">
        Rekrutierungs E-Mail<span class="text-red">*</span>
      </div>
      <q-input
        v-model="team.recruitingEmail"
        placeholder="Rekrutierungs E-Mail"
        dense
        outlined
        class="bg-white"
      ></q-input>
      <div class="text-weight-bold q-mt-md">
        Rekrutierungs Button Text<span class="text-red">*</span>
      </div>
      <q-input
        v-model="team.recruitingButtonText"
        placeholder="Rekrutierungs Button Text"
        dense
        outlined
        class="bg-white"
      ></q-input>
    </div>

    <bottom-action>
      <q-btn flat class="full-width" @click="save">
        <q-icon name="ph-floppy-disk" class="q-mr-sm"/>
        Speichern
      </q-btn>
    </bottom-action>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BottomAction from 'src/components/BottomAction.vue';
import useNotify, { NotifyType } from 'src/hooks/useNotify';
import { Team } from 'src/api/teamApi';
import { useTeamStore } from 'src/stores/teamStore';
import { timeToHourMinute } from 'src/api/format';

const dayMap = ['', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const route = useRoute();
const teamStore = useTeamStore();
const { show } = useNotify();

const id = computed(() => parseInt(route.params.id.toString(), 10));
const team = computed<Team | null>(() => teamStore.getTeam(id.value));
const trainingTimes = computed(() => team.value?.trainingTimes?.map((training) => ({
  ...training,
  from: timeToHourMinute(training.from),
  to: timeToHourMinute(training.to),
  dayOfWeek: dayMap[training.dayOfWeek],
})) || []);
// const authStore = useAuthStore();
// const { user } = storeToRefs(authStore);

async function save() {
  //
  show('saved', NotifyType.Success);
}

onMounted(async () => {
  teamStore.fetchTeam(id.value);
});
</script>
