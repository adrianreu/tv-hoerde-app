<template>
  <q-list separator>
    <q-separator/>
    <q-item
      v-for="member in modelValue"
      :key="member.id"
      class="q-px-none"
    >
      <q-item-section avatar>
        <q-img
          :src="member?.image?.url"
          fit="cover"
          :ratio="1"
          class="rounded-borders"
          style="width: 40px; height: 40px;"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label class="ellipsis">
          {{ member.firstname }} {{  member.lastname }}
        </q-item-label>
        <q-item-label caption>
          {{ positionValueToLabel(member.position) }}
        </q-item-label>
      </q-item-section>
      <q-item-section class="col-4" avatar>
        <div class="row">
          <q-btn round flat icon="ph-pencil" dense></q-btn>
          <q-btn round flat icon="ph-trash" dense @click="deleteMember(member.id)"></q-btn>
        </div>
      </q-item-section>
    </q-item>
    <q-item clickable v-ripple class="text-primary" @click="showNewTeamMemberDialog = true">
      <q-item-section class="row items-center">
        <q-item-label>
          <q-avatar size="lg">
            <q-icon name="ph-plus" size="sm"></q-icon>
          </q-avatar>
          Neuen Spieler anlegen
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-separator/>
  </q-list>

  <q-dialog v-model="showNewTeamMemberDialog">
    <q-card class="full-width">
      <q-card-section class="q-dialog__title">
        Spieler
      </q-card-section>
      <q-card-section class="q-gutter-sm">
        <div class="text-weight-medium">Vorname<span class="text-red">*</span></div>
        <q-input
          v-model="newTeamMember.firstname"
          dense
          outlined
          class="bg-white"
          clearable
          clear-icon="ph-x-circle"
        />
        <div class="text-weight-medium">Nachname<span class="text-red">*</span></div>
        <q-input
          v-model="newTeamMember.lastname"
          dense
          outlined
          class="bg-white"
          clearable
          clear-icon="ph-x-circle"
        />
        <div class="text-weight-medium">Geburtsdatum<span class="text-red">*</span></div>
        <q-input
          v-model="newTeamMember.birthDate"
          dense
          outlined
          class="bg-white"
          clearable
          type="date"
          clear-icon="ph-x-circle"
        />
        <div class="text-weight-medium">Position<span class="text-red">*</span></div>
        <q-select
          v-model="newTeamMember.position"
          dense
          outlined
          :options="positionOptions"
          class="bg-white"
          clearable
          clear-icon="ph-x-circle"
          hide-dropdown-icon="ph-caret-up"
          dropdown-icon="ph-caret-down"
          map-options
          emit-value
        />
        <div class="text-weight-medium q-mt-md">Bild</div>
        <q-file
          v-model="newTeamMember.image"
          label="Dateien wählen (.jpg, .png)"
          outlined
          accept=".jpg, .png, .jpeg, image/*"
          dense
          class="bg-white"
          clear-icon="ph-x-circle"
        >
          <template v-slot:file="{ file }">
            <q-chip
              class="full-width q-my-xs"
              square
            >
              <q-avatar>
                <q-icon name="ph-images" />
              </q-avatar>

              <div class="ellipsis relative-position">
                {{ file.name }}
              </div>

              <q-tooltip>
                {{ file.name }}
              </q-tooltip>
            </q-chip>
          </template>
        </q-file>
        <div class="text-weight-medium">Größe<span class="text-red">*</span></div>
        <q-input
          v-model="newTeamMember.height"
          dense
          outlined
          class="bg-white"
          clearable
          type="number"
          min="120"
          clear-icon="ph-x-circle"
          max="220"
          suffix="cm"
        />

        <div class="text-weight-medium">Trikotnummer<span class="text-red">*</span></div>
        <q-input
          v-model="newTeamMember.shirtNumber"
          dense
          outlined
          class="bg-white"
          clearable
          type="number"
          min="1"
          max="99"
          clear-icon="ph-x-circle"
        />
      </q-card-section>
      <q-card-actions class="row justify-end">
        <q-btn color="primary" flat @click="showNewTeamMemberDialog = false">Abbrechen</q-btn>
        <q-btn color="primary" @click="addTeamMember" unelevated :loading="loading">
          Spieler hinzufügen
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {
  Ref, computed, ref,
} from 'vue';
import { useRoute } from 'vue-router';
import useNotify, { NotifyType } from 'src/hooks/useNotify';
import {
  TeamMember, TeamMemberRequest, createTeamMember, deleteTeamMember,
} from 'src/api/teamMemberApi';
import useVolleyballPositions from 'src/hooks/useVolleyballPositions';
import { useQuasar } from 'quasar';

interface Props {
  modelValue: TeamMember[];
}

const emits = defineEmits(['update:modelValue']);
const props = defineProps<Props>();

const route = useRoute();
const $q = useQuasar();
const { show } = useNotify();
const { positionOptions, positionValueToLabel } = useVolleyballPositions();

const newTeamMember: Ref<TeamMemberRequest> = ref({
  firstname: '',
  lastname: '',
  birthDate: '',
  position: '',
  height: 0,
  shirtNumber: 0,
});
const showNewTeamMemberDialog = ref(false);
const loading = ref(false);

const id = computed(() => parseInt(route.params.id.toString(), 10));

async function addTeamMember() {
  try {
    loading.value = true;
    const fullTeamMember = await createTeamMember({
      ...newTeamMember.value,
      teams: [id.value],
    });
    emits('update:modelValue', [
      ...props.modelValue,
      fullTeamMember,
    ]);
    show('Spieler hinzugefügt', NotifyType.Success);
    showNewTeamMemberDialog.value = false;
  } catch (error) {
    console.log(error);
    show('Spieler konnte nicht hinzugefügt werden. Bitte versuche es erneut.', NotifyType.Error);
  } finally {
    loading.value = false;
  }
}

async function deleteMember(memberId: number) {
  $q.dialog({
    title: 'Bestätigen',
    message: 'Möchtest Du den Spieler wirklich löschen?',
    cancel: 'Nein',
    ok: 'Ja',
    persistent: true,
  })
    .onOk(async () => {
      try {
        await deleteTeamMember(memberId);
        emits('update:modelValue', [
          ...props.modelValue.filter((member) => member.id !== memberId),
        ]);
        show('Spieler gelöscht', NotifyType.Success);
      } catch (error) {
        console.log(error);
        show('Spieler konnte nicht gelöscht werden. Bitte versuche es erneut.', NotifyType.Error);
      } finally {
        loading.value = false;
      }
    });
}
</script>
