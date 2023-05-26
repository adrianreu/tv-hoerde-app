<template>
  <q-page padding class="q-py-md">
    <q-carousel
      v-if="images.length > 0"
      v-model="slide"
      transition-prev="jump-right"
      transition-next="jump-left"
      swipeable
      animated
      control-color="white"
      :navigation="images?.length > 1"
      arrows
      height="210px"
      class="bg-transparent text-white q-mb-md"
    >
      <q-carousel-slide
        v-for="image in images"
        :key="image.id"
        :name="image.id"
        class="q-pa-none"
      >
        <div class="row fit justify-start items-center full-height">
          <div class="col-12 full-height">
            <q-img
              :src="image.url"
              fit="contain"
              :ratio="16/9"
            ></q-img>
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
    <div class="text-h6 q-mb-sm">{{ cleanTitle }}</div>
    <div class="text-grey text-caption q-mb-md">
      {{ formattedAuthor }} {{ formattedAuthor ? '-' : '' }} {{ formattedDate }}
    </div>
    <div v-html="cleanText" class="text-justify"></div>
    <bottom-action>
      <q-btn flat class="full-width bg-accent" @click="deleteDetailPost">
        <q-icon name="delete" class="q-mr-sm"/>
        Löschen
      </q-btn>
      <q-btn flat class="full-width" :to="`/post-editor/${id}`">
        <q-icon name="edit" class="q-mr-sm"/>
        Bearbeiten
      </q-btn>
    </bottom-action>
  </q-page>
</template>

<script setup lang="ts">
import { getPost, Post, deletePost } from 'src/api/postApi';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import sanitizeHtml from 'sanitize-html';
import { toGermanDate } from 'src/api/format';
import BottomAction from 'src/components/BottomAction.vue';
import { useQuasar } from 'quasar';

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const id = computed(() => route.params.id);
const post = ref<Post>();
const slide = ref();
const images = computed(() => post?.value?.images || []);
const cleanText = computed(() => sanitizeHtml(post.value?.text || ''));
const cleanTitle = computed(() => sanitizeHtml(post.value?.title || '', {
  allowedTags: [],
  allowedAttributes: {},
  allowedIframeHostnames: [],
}));

const formattedAuthor = computed(
  () => (post.value?.author?.firstname && post.value?.author?.lastname
    ? `${post.value?.author?.firstname} ${post.value?.author?.lastname}` : ''),
);

async function loadPost() {
  try {
    post.value = await getPost(id.value.toString());
    slide.value = images.value[0].id;
  } catch (error) {
    // TODO error handling
    console.log(error);
  }
}

async function deleteDetailPost() {
  $q.dialog({
    title: 'Bestätigen',
    message: 'Möchtest Du den Beitrag wirklich löschen?',
    cancel: 'Nein',
    ok: 'Ja',
    persistent: true,
  })
    .onOk(async () => {
      // console.log('>>>> OK')
      try {
        await deletePost(id.value.toString());
        router.push('/posts');
      } catch (error) {
        // TODO error handling
        console.log(error);
      }
    });
}

const formattedDate = computed(() => toGermanDate(post?.value?.createdAt || ''));

onMounted(() => {
  loadPost();
});
</script>
