<template>
  <a :href="googleLink" class="text-primary">{{ place?.name }}</a>
</template>

<script setup lang="ts">
import { Place } from 'src/api/placeApi';
import { computed } from 'vue';

interface Props {
  place: Place | null
}
const props = withDefaults(defineProps<Props>(), {
  place: null,
});

const googleLink = computed(() => `https://maps.google.com/?q=${props.place?.street
} ${props.place?.houseNumber}, ${props.place?.zipCode} ${props.place?.city}`);
</script>
