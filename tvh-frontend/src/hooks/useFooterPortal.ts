import { computed } from 'vue';

export default function useFooterPortal() {
  const isFooterReady = computed(() => !!document?.getElementById('footer-portal'));

  return {
    isFooterReady,
  };
}
