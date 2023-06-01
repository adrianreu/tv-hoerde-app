<template>
  <q-list separator>
    <q-separator/>
    <q-item
      v-for="trainingTime in trainingTimes"
      :key="trainingTime.id"
      class="q-px-none"
    >
      <q-item-section>
        <q-item-label>
          {{ trainingTime.dayOfWeekLabel }} {{ trainingTime.from }} - {{  trainingTime.to }} Uhr
        </q-item-label>
        <q-item-label v-if="trainingTime.place?.name" caption>
          {{ trainingTime.place?.name }}
        </q-item-label>
      </q-item-section>
      <q-item-section class="col-4" avatar>
        <div class="row">
          <q-btn round flat icon="ph-pencil" dense @click="editTime(trainingTime)"></q-btn>
          <q-btn round flat icon="ph-trash" dense @click="deleteTime(trainingTime.id)"></q-btn>
        </div>
      </q-item-section>
    </q-item>
    <q-item clickable v-ripple class="text-primary" @click="showNewDialog = true">
      <q-item-section class="row items-center">
        <q-item-label>
          <q-avatar size="lg">
            <q-icon name="ph-plus" size="sm"></q-icon>
          </q-avatar>
          Neue Trainingszeit anlegen
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-separator/>
  </q-list>

  <q-dialog v-model="showNewDialog">
    <q-card class="full-width">
      <q-card-section class="q-dialog__title">
        Trainingszeit
      </q-card-section>
      <q-card-section class="q-gutter-sm">
        <div class="text-weight-medium">Tag der Woche<span class="text-red">*</span></div>
        <q-select
          v-model="newTrainingTime.dayOfWeek"
          dense
          outlined
          class="bg-white"
          clearable
          :options="dayOfWeekOptions"
          clear-icon="ph-x-circle"
          emit-value
          map-options
          dropdown-icon="ph-caret-down"
        />
        <div class="text-weight-medium">Von<span class="text-red">*</span></div>
        <q-input
          v-model="newTrainingTime.from"
          dense
          outlined
          class="bg-white"
          clearable
          clear-icon="ph-x-circle"
          type="time"
        />
        <div class="text-weight-medium">Bis<span class="text-red">*</span></div>
        <q-input
          v-model="newTrainingTime.to"
          dense
          outlined
          class="bg-white"
          clearable
          type="time"
          clear-icon="ph-x-circle"
        />
        <div class="text-weight-medium">Ort<span class="text-red">*</span></div>
        <q-select
          v-model="newTrainingTime.place"
          placeholder="Ort"
          dense
          outlined
          class="bg-white"
          :loading="loadingPlaces"
          :disable="loadingPlaces"
          :options="placeOptions"
          emit-value
          map-options
          clear-icon="ph-x-circle"
          dropdown-icon="ph-caret-down"
        />
      </q-card-section>
      <q-card-actions class="row justify-end">
        <q-btn color="primary" flat @click="resetNewDialog">Abbrechen</q-btn>
        <q-btn color="primary" @click="saveTrainingTime" unelevated :loading="loading">
          {{ editingId > 0 ? 'Trainingszeit speichern' : 'Trainingszeit hinzufügen' }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  Ref, computed, onMounted, ref,
} from 'vue';
import useNotify, { NotifyType } from 'src/hooks/useNotify';
import { useQuasar, date } from 'quasar';
import {
  TrainingTime, TrainingTimeRequest, createTrainingTime, deleteTrainingTime, updateTrainingTime,
} from 'src/api/trainingTimeApi';
import { useRoute } from 'vue-router';
import { timeToHourMinute } from 'src/api/format';
import usePlaceApi from 'src/hooks/usePlaceApi';
import useLog from 'src/hooks/useLog';

interface Props {
  modelValue: TrainingTime[];
}

const resetTrainingTime = {
  dayOfWeek: 1,
  from: '',
  to: '',
  place: undefined,
};

const dayMap = ['', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const emits = defineEmits(['update:modelValue']);
const props = defineProps<Props>();

const route = useRoute();
const $q = useQuasar();
const { show } = useNotify();
const { log } = useLog();
const { loadPlaceOptions, loadingPlaces, placeOptions } = usePlaceApi();

const newTrainingTime: Ref<TrainingTimeRequest> = ref(resetTrainingTime);
const showNewDialog = ref(false);
const loading = ref(false);
const editingId = ref(-1);

const dayOfWeekOptions = computed(() => dayMap.map((day, index) => {
  if (day === '') {
    return undefined;
  }
  return {
    label: day,
    value: index,
  };
}));
const id = computed(() => parseInt(route.params.id.toString(), 10));
const trainingTimes = computed(() => props.modelValue?.map((training) => ({
  ...training,
  from: timeToHourMinute(training.from),
  to: timeToHourMinute(training.to),
  dayOfWeekLabel: dayMap[training.dayOfWeek],
})) || []);

function resetNewDialog() {
  showNewDialog.value = false;
  newTrainingTime.value = resetTrainingTime;
  editingId.value = -1;
}

async function saveTrainingTime() {
  console.log(newTrainingTime.value.dayOfWeek);
  if (editingId.value > 0) {
    try {
      loading.value = true;
      const to = date.formatDate(date.extractDate(newTrainingTime.value.to, 'HH:mm'), 'HH:mm:ss.SSS');
      const from = date.formatDate(date.extractDate(newTrainingTime.value.from, 'HH:mm'), 'HH:mm:ss.SSS');
      const fullTrainingTime = await updateTrainingTime(editingId.value, {
        ...newTrainingTime.value,
        teams: [id.value],
        to,
        from,
      });
      emits('update:modelValue', [
        ...props.modelValue.filter((time) => time.id !== editingId.value),
        {
          ...props.modelValue.find((time) => time.id === editingId.value),
          ...fullTrainingTime,
        },
      ]);
      show('Trainingszeit gespeichert', NotifyType.Success);
      resetNewDialog();
    } catch (error) {
      log('TeamMemberApi', error);
      show('Trainingszeit konnte nicht gespeichert werden. Bitte versuche es erneut.', NotifyType.Error);
    } finally {
      loading.value = false;
    }
  } else {
    try {
      loading.value = true;
      const to = date.formatDate(date.extractDate(newTrainingTime.value.to, 'HH:mm'), 'HH:mm:ss.SSS');
      const from = date.formatDate(date.extractDate(newTrainingTime.value.from, 'HH:mm'), 'HH:mm:ss.SSS');

      const fullTrainingTime = await createTrainingTime({
        ...newTrainingTime.value,
        teams: [id.value],
        to,
        from,
      });
      const place = placeOptions.value?.find(
        (option) => option.value === newTrainingTime.value.place,
      );
      if (place) {
        fullTrainingTime.place = {
          ...fullTrainingTime.place,
          name: place.label,
          id: place.value,
        };
      }
      emits('update:modelValue', [
        ...props.modelValue,
        fullTrainingTime,
      ]);
      show('Trainingszeit hinzugefügt', NotifyType.Success);
      resetNewDialog();
    } catch (error) {
      console.log(error);
      show('Trainingszeit konnte nicht hinzugefügt werden. Bitte versuche es erneut.', NotifyType.Error);
    } finally {
      loading.value = false;
    }
  }
}

function editTime(time: TrainingTime) {
  editingId.value = time.id;
  newTrainingTime.value = { ...time, place: time.place.id };
  showNewDialog.value = true;
}

async function deleteTime(timeId: number) {
  $q.dialog({
    title: 'Bestätigen',
    message: 'Möchtest Du die Trainingszeit wirklich löschen?',
    cancel: 'Nein',
    ok: 'Ja',
    persistent: true,
  })
    .onOk(async () => {
      try {
        await deleteTrainingTime(timeId);
        emits('update:modelValue', [
          ...props.modelValue.filter((time) => time.id !== timeId),
        ]);
        show('Trainingszeit gelöscht', NotifyType.Success);
      } catch (error) {
        console.log(error);
        show('Trainingszeit konnte nicht gelöscht werden. Bitte versuche es erneut.', NotifyType.Error);
      } finally {
        loading.value = false;
      }
    });
}

onMounted(() => {
  loadPlaceOptions();
});
</script>
