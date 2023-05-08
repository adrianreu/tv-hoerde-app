<template>
  <q-page padding>
    {{ name }}
    {{ id }}
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const name = route.path;
const id = computed(() => route.params.id);
</script>
