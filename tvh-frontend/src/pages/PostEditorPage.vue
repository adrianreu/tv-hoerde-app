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
          v-model="post.images"
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
import { Post, getPost } from 'src/api/postApi';

const route = useRoute();
const id = computed(() => route.params.id.toString());
const isNew = computed(() => id.value === 'new');
const post = ref<Post>({
  text: '',
  title: '',
  images: [],
  id: 0,
  createdAt: '',
  publishedAt: '',
  updatedAt: '',
});

async function loadPost() {
  try {
    post.value = await getPost(id.value.toString());
  } catch (error) {
    // TODO error handling
    console.log(error);
  }
}

function cancelFile(index: number) {
  post.value.images.splice(index, 1);
}

function save() {
  if (isNew.value) {
    console.log('neuen beitrag angelegt');
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
