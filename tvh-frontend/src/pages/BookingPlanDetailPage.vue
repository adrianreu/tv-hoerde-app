<template>
  <q-page padding>
    <div class="row q-col-gutter-lg q-mb-md items-center">
      <div class="col-shrink">
        <q-btn round flat icon="chevron_left" color="black"></q-btn>
      </div>
      <div class="col-grow text-center text-subtitle1 text-weight-bold">Mittwoch, 30.05.2023</div>
      <div class="col-shrink text-right">
        <q-btn round flat icon="chevron_right" color="black"></q-btn>
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-3 text-weight-bold text-center">Uhrzeit</div>
      <div class="col-3 text-weight-bold text-center">Feld 1</div>
      <div class="col-3 text-weight-bold text-center">Feld 2</div>
      <div class="col-3 text-weight-bold text-center">Feld 3</div>
      <template  v-for="slot, i in timeSlots" :key="slot">
        <div class="col-3 text-center">
          {{ slot }}
        </div>
        <div class="col-3 text-center">
          <div
            class="full-width full-height position-relative"
            style="position: relative"
            v-if="i < timeSlots.length - 1"
          >
            <div
              class="absolute full-width full-height bg-grey-3 rounded-borders"
              style="top: 50%; transform: translateY(20%)"
              v-ripple
            >
            frei
            </div>
          </div>
        </div>
        <div class="col-3 text-center">
          <div
            class="full-width full-height position-relative"
            style="position: relative"
            v-if="i < timeSlots.length - 1"
          >
            <div
              class="absolute full-width full-height bg-grey-3 rounded-borders"
              style="top: 50%; transform: translateY(20%)"
              v-ripple
            >
            frei
            </div>
          </div>
        </div>
        <div class="col-3 text-center">
          <div
            class="full-width full-height position-relative"
            style="position: relative"
            v-if="i < timeSlots.length - 1"
          >
            <div
              class="absolute full-width full-height bg-grey-3 rounded-borders"
              v-ripple
              style="top: 50%; transform: translateY(20%)"
            >
            frei
            </div>
          </div>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = computed(() => route.params.id);
const range = [10, 22];
const timeSlots: string[] = [];
for (let i = range[0]; i <= range[1]; i += 1) {
  timeSlots.push(`${i}:00`);
  if (i < range[1]) {
    timeSlots.push(`${i}:30`);
  }
}
</script>
