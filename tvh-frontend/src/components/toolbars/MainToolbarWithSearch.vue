<template>
  <q-toolbar>
    <q-avatar rounded class="q-mr-md">
      <q-img src="~assets/tvhlogo.png"></q-img>
    </q-avatar>
    <Transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      mode="out-in"
      appear
      :duration="200"
    >
      <q-input
        v-if="showSearch || searchQuery.length > 0"
        v-model="searchQuery"
        standout
        dense
        outlined
        type="search"
        class="full-width"
        ref="searchInput"
        placeholder="Such nach etwas..."
        :debounce="800"
        @update:model-value="doSearch()"
        @focus="showSearch = true"
        @blur="showSearch = false"
      >
        <template v-slot:append>
          <q-icon name="search" @click="showSearch = false" />
        </template>
      </q-input>
      <div v-else class="row full-width items-center">
        <q-toolbar-title class="text-black" v-if="!showSearch">
          {{ route.name }}
        </q-toolbar-title>
        <q-btn round color="accent" icon="search" flat @click="focusSearchInput" />
      </div>
    </Transition>
    <q-btn round color="accent" icon="tune" flat class="q-ml-sm" @click="showFilterDialog = true" />
    <q-dialog v-model="showFilterDialog">
      <q-card class="full-width">
        <q-card-section class="q-dialog__title">
          Filter
        </q-card-section>
        <q-card-section class="q-gutter-sm">
          <div class="text-weight-medium">Mannschaft</div>
          <q-select
            v-model="teamFilter"
            dense
            outlined
            :options="teams"
            class="bg-white"
            clearable
            option-value="id"
            option-label="name"
            emit-value
            map-options
          />
        </q-card-section>
        <q-card-actions class="row justify-end">
          <q-btn color="primary" flat @click="showFilterDialog = false">Abbrechen</q-btn>
          <q-btn color="primary" flat @click="doSearch">Anwenden</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-toolbar>
</template>

<script setup lang="ts">
import { QInput } from 'quasar';
import { usePostSearchStore } from 'src/stores/postSearchStore';
import { Ref, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTeamStore } from 'src/stores/teamStore';

const route = useRoute();
const postSearchStore = usePostSearchStore();
const teamStore = useTeamStore();

const showSearch = ref(false);
const showFilterDialog = ref(false);
const searchInput: Ref<QInput | null> = ref(null);
const { searchQuery, teamFilter } = storeToRefs(postSearchStore);
const { teams } = storeToRefs(teamStore);

function focusSearchInput() {
  showSearch.value = true;
  setTimeout(() => {
    searchInput.value?.focus();
  }, 500);
}

function doSearch() {
  showFilterDialog.value = false;
  postSearchStore.loadPage();
}

onMounted(() => {
  teamStore.fetchTeams();
});
</script>
