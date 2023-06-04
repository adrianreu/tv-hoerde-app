<template>
  <q-icon
    name="ph-volleyball"
    color="primary"
    size="xl"
    class="loading-animation"
  ></q-icon>
</template>

<style lang="scss">
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
