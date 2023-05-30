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
            <q-icon name="ph-caret-right" />
          </q-item-section>
        </q-item>
        <q-separator/>
      </q-list>
    </loading-wrapper>
    <!-- <bottom-action>
      <q-btn flat class="full-width">
        <q-icon name="ph-plus" class="q-mr-sm"></q-icon>Neues Team
      </q-btn>
    </bottom-action> -->
  </q-page>
</template>

<script setup lang="ts">
import { Team } from 'src/api/teamApi';
import LoadingWrapper from 'src/components/LoadingWrapper.vue';
import { useTeamStore } from 'src/stores/teamStore';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import BottomAction from 'src/components/BottomAction.vue';

const router = useRouter();
const teamStore = useTeamStore();
const loading = ref<boolean>(false);

function goToDetailPage(team: Team) {
  router.push({ path: `/teams/${team.id}`, query: { title: team.name } });
}

onMounted(() => {
  teamStore.fetchTeams();
});
</script>
