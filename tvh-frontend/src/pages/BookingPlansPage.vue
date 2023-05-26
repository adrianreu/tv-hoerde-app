<template>
  <q-page>
    <loading-wrapper :loading="loading">
      <q-list separator>
        <q-separator/>
        <q-item
          clickable
          v-ripple
          v-for="place in bookablePlaces"
          :key="place.id"
          @click="goToDetailPage(place)"
        >
          <q-item-section>
            <q-item-label>{{ place.name }}</q-item-label>
            <q-item-label v-if="place?.city" caption>
              {{ place.street }} {{ place.houseNumber }}, {{ place.zipCode }} {{ place.city }}
            </q-item-label>
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
import { Ref, onMounted, ref } from 'vue';
import LoadingWrapper from 'src/components/LoadingWrapper.vue';
import { getBookableCourts } from 'src/api/bookableCourtApi';
import { Place } from 'src/api/placeApi';
import { useRouter } from 'vue-router';

const router = useRouter();

const bookablePlaces: Ref<Place[]> = ref([]);
const loading = ref(false);

function goToDetailPage(place: Place) {
  router.push({ path: `/booking-plans/${place.id}` });
}

onMounted(async () => {
  const bookableCourts = await getBookableCourts();
  const places: Place[] = bookableCourts
    .map((court) => court.place)
    .filter((place) => !!place) as Place[];
  bookablePlaces.value = [...new Map(places.map((place) => [place?.id, place])).values()];
});
</script>
