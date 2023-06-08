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
            <q-icon name="ph-caret-right" />
          </q-item-section>
        </q-item>
        <q-separator/>
        <q-item-label header v-if="changeRequests.length > 0">Anfragen</q-item-label>
        <q-expansion-item
          v-for="changeRequest in changeRequests"
          :key="changeRequest.id"
          icon="none"
          group="changeRequests"
          expand-icon="ph-caret-down"
          expanded-icon="ph-caret-up"
        >
          <template v-slot:header>
            <q-item-section>
              {{ formatChangeRequestLabel(changeRequest) }}
            </q-item-section>
          </template>
          <q-card
            class="q-mx-md shadow-0"
            bordered
          >
            <q-card-section>
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <div class="text-weight-bold">
                    Zeitraum
                  </div>
                  <div>
                    {{ date.formatDate(new Date(changeRequest.from), 'HH:mm') }} -
                    {{ date.formatDate(new Date(changeRequest.to), 'HH:mm') }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-weight-bold">
                    Angefragt von
                  </div>
                  <div>
                    {{ changeRequest.requestedBy.firstname }}
                    {{ changeRequest.requestedBy.lastname }}
                  </div>
                </div>
                <div class="col-12">
                  <div class="text-weight-bold">
                    Nachricht
                  </div>
                  <div>
                    {{ changeRequest.message }}
                  </div>
                </div>
              </div>
            </q-card-section>
            <div class="row">
              <div class="col-6">
                <q-btn
                  class="full-width"
                  unelevated
                  color="primary"
                  square
                >Anfrage annehmen</q-btn>
              </div>
              <div class="col-6">
                <q-btn
                  class="full-width"
                  unelevated
                  color="accent"
                  square
                >Anfrage ablehnen</q-btn>
              </div>
            </div>
          </q-card>
        </q-expansion-item>
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
import { ChangeRequest, getChangeRequestsForUser } from 'src/api/changeRequestApi';
import { useAuthStore } from 'src/stores/authStore';
import { date } from 'quasar';

const router = useRouter();
const authStore = useAuthStore();

const bookablePlaces: Ref<Place[]> = ref([]);
const changeRequests: Ref<ChangeRequest[]> = ref([]);
const loading = ref(false);

function goToDetailPage(place: Place) {
  router.push({ path: `/booking-plans/${place.id}`, query: { title: place.name } });
}

function formatChangeRequestLabel(changeRequest: ChangeRequest) {
  const { name } = changeRequest.booking.bookedCourt;
  const from = date.formatDate(changeRequest.booking.startTime, 'DD.MM.YYYY HH:mm');
  const to = date.formatDate(changeRequest.booking.endTime, 'HH:mm');
  return `für ${name} ${from} - ${to} Uhr`;
}

onMounted(async () => {
  const bookableCourts = await getBookableCourts();
  const places: Place[] = bookableCourts
    .map((court) => court.place)
    .filter((place) => !!place) as Place[];
  bookablePlaces.value = [...new Map(places.map((place) => [place?.id, place])).values()];
  changeRequests.value = await getChangeRequestsForUser(authStore.user?.id);
});
</script>
