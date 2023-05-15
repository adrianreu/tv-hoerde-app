<template>
  <teleport v-if="(footerRendered || footerExists) && loggedIn" to="#footer-portal">
    <slot></slot>
  </teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/authStore';
import { computed, onMounted, ref } from 'vue';

const authStore = useAuthStore();
const { loggedIn } = storeToRefs(authStore);

const footerRendered = ref(false);
const footerExists = computed(() => !!document?.getElementById('footer-portal'));

function checkingFooter() {
  if (footerRendered.value || footerExists.value) return;
  setTimeout(() => {
    console.log('check');
    footerRendered.value = !!document?.getElementById('footer-portal');
    checkingFooter();
  }, 100);
}

onMounted(() => {
  if (!footerRendered.value && !footerExists.value) {
    checkingFooter();
  }
});
</script>
