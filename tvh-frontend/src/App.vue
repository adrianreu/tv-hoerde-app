<template>
  <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();

$q.iconMapFn = (iconName) => {
  if (iconName.startsWith('ph-') === true) {
    return {
      cls: `ph-light ${iconName}`,
    };
  }
  return { cls: iconName };
};
</script>
