<template>
  <q-toolbar>
    <q-avatar rounded>
      <q-img src="~assets/tvhlogo.png"></q-img>
    </q-avatar>
    <q-toolbar-title class="text-black">
          {{ route.name }}
    </q-toolbar-title>
  </q-toolbar>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
