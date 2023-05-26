<template>
  <q-page padding>
    <div class="q-gutter-sm">
      <div class="text-weight-bold">Titel</div>
      <q-input
        v-model="post.title"
        placeholder="Titel"
        dense
        outlined
        class="bg-white"
      ></q-input>

      <div class="text-weight-bold q-mt-md">Text</div>
      <q-editor v-model="post.text" min-height="5rem" />

      <div class="text-weight-bold q-mt-md">Betroffene Mannschaft</div>
      <q-select
        v-model="post.relatedTeam"
        dense
        outlined
        :options="teams"
        class="bg-white"
        clearable
        option-value="id"
        option-label="name"
        emit-value
        map-options
      />

      <div class="text-weight-bold q-mt-md">Bilder</div>
      <div>
        <q-file
          v-model="images"
          label="Dateien wählen (.jpg, .png)"
          outlined
          multiple
          accept=".jpg, .png, .jpeg, image/*"
          dense
          class="bg-white"
        >
          <template v-slot:file="{ index, file }">
            <q-chip
              class="full-width q-my-xs"
              square
              removable
              @remove="cancelFile(index)"
            >
              <q-avatar>
                <q-icon name="photo" />
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
      </div>
    </div>
    <bottom-action>
      <q-btn flat class="full-width" @click="save" :loading="loading" :disable="loading">
        <q-icon name="save" class="q-mr-sm"/>
        {{ isNew ? 'Neu anlegen' : 'Speichern' }}
      </q-btn>
    </bottom-action>
  </q-page>
</template>

<script setup lang="ts">
import {
  Ref,
  computed,
  onMounted,
  ref,
} from 'vue';
import { useRoute } from 'vue-router';
import BottomAction from 'src/components/BottomAction.vue';
import { getPost, createPost, PostRequest } from 'src/api/postApi';
import { useAuthStore } from 'src/stores/authStore';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { Team, getTeams } from 'src/api/teamApi';

// composables
const route = useRoute();
const $q = useQuasar();
const authStore = useAuthStore();

// refs
const { user } = storeToRefs(authStore);
const post = ref<PostRequest>({
  text: '',
  title: '',
  relatedTeam: undefined,
});
const images = ref<File[]>([]);
const teams: Ref<Team[]> = ref([]);
const loading: Ref<boolean> = ref(false);

// computed
const id = computed(() => route.params.id.toString());
const isNew = computed(() => id.value === 'new');

// functions
async function loadPost() {
  try {
    const fullPost = await getPost(id.value.toString());
    post.value = {
      text: fullPost.text,
      title: fullPost.title,
    };
    console.log(fullPost);
    images.value = fullPost?.images?.map((image) => new File([], image.name)) || [];
  } catch (error) {
    // TODO error handling
    console.log(error);
  } finally {
    loading.value = false;
  }
}

function cancelFile(index: number) {
  images.value.splice(index, 1);
}

async function save() {
  if (isNew.value) {
    loading.value = true;
    try {
      const fullPost = await createPost({
        ...post.value,
        author: user.value?.id,
      }, images.value);
      post.value = {
        text: fullPost.text,
        title: fullPost.title,
      };
      $q.notify({
        message: 'Beitrag erstellt',
        icon: 'done',
        color: 'white',
        textColor: 'black',
        iconColor: 'green',
        classes: 'q-mb-xxl',
      });
    } catch (error) {
      // TODO add error handling
      console.log(error);
    }
  } else {
    console.log('beitrag gespeichert');
  }
}

// hooks
onMounted(async () => {
  teams.value = await getTeams();
  if (!isNew.value) {
    loadPost();
  }
});
</script>
