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
        <q-separator v-if="changeRequests.length > 0" />
        <q-expansion-item
          v-for="changeRequest in changeRequests"
          :key="changeRequest.id"
          group="changeRequests"
          expand-icon="ph-caret-down"
          expanded-icon="ph-caret-up"
          >
          <template v-slot:header>
            <q-item-section avatar>
              <q-avatar>
                <q-icon
                  v-if="changeRequest.status === 'ACCEPTED'"
                  color="green"
                  name="ph-check"
                  />
                  <q-icon
                  v-else-if="changeRequest.status === 'REJECTED'"
                  color="primary"
                  name="ph-x"
                  />
                  <q-icon
                  v-else-if="changeRequest.requestedBy.id === userId"
                  name="ph-paper-plane-right"
                  class="rotate-icon-180deg"
                  />
                  <q-icon
                  v-else
                  name="ph-paper-plane-right"
                  />
                </q-avatar>
              </q-item-section>

            <q-item-section>
              <q-item-label>
                Anfrage
                <span v-if="changeRequest.status === 'ACCEPTED'">angenommen</span>
                <span v-else-if="changeRequest.status === 'REJECTED'">abgelehnt</span>
                <span v-else-if="changeRequest.requestedBy.id === userId">gesendet</span>
                <span v-else>erhalten</span>
              </q-item-label>
              <q-item-label caption>{{ formatChangeRequestLabel(changeRequest) }}</q-item-label>
            </q-item-section>
          </template>

          <q-card
            class="q-mx-md shadow-0 q-mb-md"
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
                    {{ date.formatDate(new Date(changeRequest.to), 'HH:mm') }} Uhr
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
                <div class="col-6">
                  <div class="text-weight-bold">
                    Status
                  </div>
                  <div>
                    {{ changeRequest.status }}
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
            <div class="row" v-if="changeRequest.requestedBy.id !== userId">
              <div class="col-6">
                <q-btn
                class="full-width"
                unelevated
                color="primary"
                square
                  @click="accept(changeRequest.id)"
                >Anfrage annehmen</q-btn>
              </div>
              <div class="col-6">
                <q-btn
                class="full-width"
                unelevated
                color="accent"
                  square
                  @click="reject(changeRequest.id)"
                  >Anfrage ablehnen</q-btn>
                </div>
              </div>
            </q-card>
          </q-expansion-item>
          <q-separator v-if="changeRequests.length > 0" />
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
import {
  ChangeRequest, acceptChangeRequest, getChangeRequestsForUser, rejectChangeRequest,
} from 'src/api/changeRequestApi';
import { useAuthStore } from 'src/stores/authStore';
import { date } from 'quasar';
import useApprovalDialog from 'src/hooks/useDeleteDialog';
import { storeToRefs } from 'pinia';
import useLog from 'src/hooks/useLog';
import useNotify, { NotifyType } from 'src/hooks/useNotify';

const router = useRouter();
const authStore = useAuthStore();
const { log } = useLog();
const { show } = useNotify();
const { checkApproval } = useApprovalDialog();
const { userId } = storeToRefs(authStore);

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

async function accept(changeRequestId: number) {
  try {
    const approved = await checkApproval(
      'Bist du sicher, dass Du die angefragte Zeit abgeben möchtest? Der restliche Teil der Zeit bleibt dir erhalten.',
    );
    if (approved) {
      await acceptChangeRequest(changeRequestId);
      changeRequests.value = await getChangeRequestsForUser(userId.value);
    }
  } catch (error) {
    log('BookingPlansPage - accept', error);
    show(
      'Es ist ein Fehler aufgetreten. Wahrscheinlich wurde der Status bereits gesetzt.',
      NotifyType.Error,
    );
  }
}

async function reject(changeRequestId: number) {
  try {
    const approved = await checkApproval(
      'Bist du sicher, dass Du die Anfrage ablehnen möchtest?',
    );
    if (approved) {
      await rejectChangeRequest(changeRequestId);
      changeRequests.value = await getChangeRequestsForUser(userId.value);
    }
  } catch (error) {
    log('BookingPlansPage - reject', error);
    show(
      'Es ist ein Fehler aufgetreten. Wahrscheinlich wurde der Status bereits gesetzt.',
      NotifyType.Error,
    );
  }
}

onMounted(async () => {
  const bookableCourts = await getBookableCourts();
  const places: Place[] = bookableCourts
    .map((court) => court.place)
    .filter((place) => !!place) as Place[];
  bookablePlaces.value = [...new Map(places.map((place) => [place?.id, place])).values()];
  changeRequests.value = await getChangeRequestsForUser(userId.value);
});
</script>

<style lang="scss">
.rotate-icon-180deg.q-icon {
  transform: rotate(180deg);
}
</style>
