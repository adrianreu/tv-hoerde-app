<template>
  <q-page padding>
    {{ name }}
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const name = route.path;
</script>
