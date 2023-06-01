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
      <team-member-editor v-model="team.teamMembers" />

      <div class="text-weight-bold q-mt-md">Trainingszeiten<span class="text-red">*</span></div>
      <training-time-editor v-model="team.trainingTimes" />

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
      <q-btn flat class="full-width" @click="save" :loading="loading">
        <q-icon name="ph-floppy-disk" class="q-mr-sm"/>
        Speichern
      </q-btn>
    </bottom-action>
  </q-page>
</template>

<script setup lang="ts">
import {
  computed, onMounted, ref,
} from 'vue';
import { useRoute } from 'vue-router';
import BottomAction from 'src/components/BottomAction.vue';
import useNotify, { NotifyType } from 'src/hooks/useNotify';
import { TeamRequest, updateTeam } from 'src/api/teamApi';
import { useTeamStore } from 'src/stores/teamStore';
import TeamMemberEditor from 'src/components/TeamMemberEditor.vue';
import TrainingTimeEditor from 'src/components/TrainingTimeEditor.vue';
import useLog from 'src/hooks/useLog';

const route = useRoute();
const teamStore = useTeamStore();
const { show } = useNotify();
const { log } = useLog();

const loading = ref(false);

const id = computed(() => parseInt(route.params.id.toString(), 10));
const team = ref<TeamRequest>({
  name: '',
  league: '',
  recruitingText: '',
  recruitingTitle: '',
  recruitingButtonText: '',
  isRecruiting: false,
  recruitingEmail: '',
});

async function save() {
  try {
    loading.value = true;
    await updateTeam(id.value, team.value);
    show('Mannschaft aktualisiert.', NotifyType.Success);
  } catch (error) {
    log('TeamAPI', error);
    show('Mannschaft konnte nicht aktualisiert werden. Bitte versuche es erneut.', NotifyType.Error);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await teamStore.fetchTeam(id.value);
  const teamFromStore = teamStore.getTeam(id.value);
  if (teamFromStore) {
    team.value = { ...teamFromStore };
  }
});
</script>
