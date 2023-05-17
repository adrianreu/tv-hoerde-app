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
      <q-btn flat class="full-width" @click="save">
        <q-icon name="save" class="q-mr-sm"/>
        {{ isNew ? 'Neu anlegen' : 'Speichern' }}
      </q-btn>
    </bottom-action>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import BottomAction from 'src/components/BottomAction.vue';
import { getPost, createPost, PostRequest } from 'src/api/postApi';
import { useAuthStore } from 'src/stores/authStore';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';

const route = useRoute();
const $q = useQuasar();

const id = computed(() => route.params.id.toString());
const isNew = computed(() => id.value === 'new');
const post = ref<PostRequest>({
  text: '',
  title: '',
});

const images = ref<File[]>([]);
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

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
  }
}

function cancelFile(index: number) {
  images.value.splice(index, 1);
}

async function save() {
  if (isNew.value) {
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
  } else {
    console.log('beitrag gespeichert');
  }
}

onMounted(() => {
  if (!isNew.value) {
    loadPost();
  }
});
</script>
