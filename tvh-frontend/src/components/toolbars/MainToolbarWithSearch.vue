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
    <q-btn round color="accent" icon="tune" flat />
  </q-toolbar>
</template>

<script setup lang="ts">
import { QInput } from 'quasar';
import { usePostSearchStore } from 'src/stores/postSearchStore';
import { Ref, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

const route = useRoute();
const postSearchStore = usePostSearchStore();
const showSearch = ref(false);
const searchInput: Ref<QInput | null> = ref(null);
const { searchQuery } = storeToRefs(postSearchStore);

function focusSearchInput() {
  showSearch.value = true;
  setTimeout(() => {
    searchInput.value?.focus();
  }, 500);
}

function doSearch() {
  postSearchStore.loadPage();
}
</script>
