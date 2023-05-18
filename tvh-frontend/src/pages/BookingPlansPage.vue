<template>
  <q-page>
    <loading-wrapper :loading="loading">
      <q-list separator>
        <q-separator/>
        <q-item
          clickable
          v-ripple
          v-for="place in places"
          :key="place.id"
          @click="goToDetailPage(place)"
        >
          <q-item-section>
            <q-item-label v-if="place.league" caption>{{ place.league }}</q-item-label>
            <q-item-label>{{ place.name }}</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>
        <q-separator/>
      </q-list>
    </loading-wrapper>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import LoadingWrapper from 'src/components/LoadingWrapper.vue';

const places = ref([]);

onMounted(() => {
  // fetch places
});
</script>
