<template>
  <div class="relative full-height" style="min-height: 100%">
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
      :duration="100"
    >
      <div
        class="absolute"
        v-if="loading"
        style="right: 50%; top: 50%; transform: translateX(50%) translateY(50%)"
      >
        <div class="column">
          <q-icon
            name="sports_volleyball"
            color="primary"
            size="xl"
            class="loading-animation"
          ></q-icon>
          Lädt ...
        </div>
      </div>
    </transition>
    <div :class="{
      'loading-wrapper__overlay': loading,
    }">
      <slot></slot>

    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading: boolean;
}
withDefaults(defineProps<Props>(), {
  loading: false,
});
</script>

<style lang="scss">
.loading-wrapper {
  &__overlay {
    opacity: 0.1;
    z-index: 999;
  }
}

@keyframes rolling-ball {
  0% {
    transform: rotateZ(-10deg);
  }

  25% {
    transform: rotateZ(600deg);
  }

  50% {
    transform: rotateZ(0deg);
  }

  75% {
    transform: rotateZ(600deg);
  }
  100% {
    transform: rotateZ(-10deg);
  }
}

.loading-animation {
  z-index: 100;
  animation-name: rolling-ball;
  animation-duration: 4s;
  // animation-delay: 1.2s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}
</style>
