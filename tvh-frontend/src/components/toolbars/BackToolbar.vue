<template>
  <q-toolbar>
    <q-btn round flat icon="ph-arrow-left" color="black" @click="router.go(-1)"></q-btn>
    <q-toolbar-title class="text-black">
      {{ title }}
    </q-toolbar-title>
  </q-toolbar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const title = computed(() => route.query.title || route.name);
</script>
