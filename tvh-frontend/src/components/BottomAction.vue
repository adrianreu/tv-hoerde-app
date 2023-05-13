<template>
  <teleport v-if="isFooterReady && loggedIn" to="#footer-portal">
    <slot></slot>
  </teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import useFooterPortal from 'src/hooks/useFooterPortal';
import { useAuthStore } from 'src/stores/authStore';

const authStore = useAuthStore();
const { isFooterReady } = useFooterPortal();
const { loggedIn } = storeToRefs(authStore);
</script>
