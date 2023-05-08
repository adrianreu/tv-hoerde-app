<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-transparent row items-center" style="height: 60px">
      <router-view name="header"></router-view>
      <q-toolbar>
        <q-avatar rounded>
          <q-img src="~assets/tvhlogo.png"></q-img>
        </q-avatar>
        <q-toolbar-title class="text-black">
          {{ route.name }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      side="right"
    >
      <q-list>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer>
      <q-tabs
        dense
        class="text-black bg-white"
        indicator-color="transparent"
        active-color="primary"
      >
        <q-route-tab icon="newspaper" label="News" class="q-py-sm" to="/articles" />
        <q-route-tab icon="group" label="Teams" class="q-py-sm" to="/teams" />
        <q-route-tab icon="event" label="Termine" class="q-py-sm" to="/events" />
        <q-route-tab icon="login" label="Anmeldung" class="q-py-sm" to="/login" />
      </q-tabs>
      </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const leftDrawerOpen = ref(false);

const route = useRoute();

function toggleLeftDrawer(): void {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
