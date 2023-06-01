<template>
  <q-page padding>
    <div class="q-gutter-sm">
      <div class="text-weight-bold">Eventtitel<span class="text-red">*</span></div>
      <q-input
        v-model="event.name"
        placeholder="Titel"
        dense
        outlined
        class="bg-white"
      ></q-input>

      <div class="text-weight-bold q-mt-md">Eventtermin<span class="text-red">*</span></div>
      <q-input
        :model-value="formattedEventDate"
        placeholder="Titel"
        dense
        outlined
        class="bg-white"
        @click="showDateDialog = true"
      />

      <div class="text-weight-bold q-mt-md">Eventort</div>
      <q-select
        v-model="event.place"
        placeholder="Ort"
        dense
        outlined
        class="bg-white"
        :loading="loadingPlaces"
        :disable="loadingPlaces"
        :options="placeOptions"
        emit-value
        map-options
        dropdown-icon="ph-caret-down"
      />
    </div>

    <q-dialog v-model="showDateDialog">
      <q-card>
        <q-date
          v-model="event.date"
          mask="YYYY-MM-DDTHH:mm:ss.SSSZ"
          @update:model-value="{
            showDateDialog = false;
            showTimeDialog = true;
          }"
        />
        <q-card-actions class="row justify-end">
          <q-btn
            flat
            label="Übernehmen"
            color="primary"
            v-close-popup
            @click="showTimeDialog = true"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showTimeDialog" persistent>
      <q-card>
        <q-time v-model="event.date" mask="YYYY-MM-DDTHH:mm:ss.SSSZ" format24h />

        <q-card-actions class="row justify-end">
          <q-btn
            flat
            label="Übernehmen"
            color="primary"
            v-close-popup
            @click="showTimeDialog = true"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <bottom-action>
      <q-btn flat class="full-width" @click="save">
        <q-icon name="ph-floppy-disk" class="q-mr-sm"/>
        {{ isNew ? 'Neu anlegen' : 'Speichern' }}
      </q-btn>
    </bottom-action>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import BottomAction from 'src/components/BottomAction.vue';
import { EventRequest, createEvent, getEvent } from 'src/api/eventApi';
import { toGermanDateTime } from 'src/api/format';
import { mapStrapiRequestData } from 'src/api/strapiMapper';
import useNotify, { NotifyType } from 'src/hooks/useNotify';
import usePlaceApi from 'src/hooks/usePlaceApi';

const route = useRoute();
const { show } = useNotify();
const { loadPlaceOptions, loadingPlaces, placeOptions } = usePlaceApi();

const event = ref<EventRequest>({
  date: new Date().toISOString(),
  name: '',
});
const showDateDialog = ref(false);
const showTimeDialog = ref(false);

const id = computed(() => route.params.id.toString());
const isNew = computed(() => id.value === 'new');
const formattedEventDate = computed(() => toGermanDateTime(event.value.date));
// const authStore = useAuthStore();
// const { user } = storeToRefs(authStore);

async function loadEvent() {
  try {
    event.value = mapStrapiRequestData(await getEvent(id.value.toString()));
  } catch (error) {
    // TODO error handling
    console.log(error);
  }
}

async function save() {
  if (isNew.value) {
    const newEvent = await createEvent(event.value);
    event.value = { ...newEvent, place: newEvent.place?.id };
    show('Event erstellt', NotifyType.Success);
  } else {
    console.log('event gespeichert');
  }
}

onMounted(() => {
  loadPlaceOptions();
  if (!isNew.value) {
    loadEvent();
  }
});
</script>
