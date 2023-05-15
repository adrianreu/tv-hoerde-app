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
    <div class="text-grey text-caption q-mb-md">{{ post?.author }} - {{ formattedDate }}</div>
    <div v-html="cleanText" class="text-justify"></div>
    <bottom-action>
      <q-btn flat class="full-width" :to="`/post-editor/${id}`">
        <q-icon name="edit" class="q-mr-sm"/>
        Bearbeiten
      </q-btn>
    </bottom-action>
  </q-page>
</template>

<script setup lang="ts">
import { getPost, Post } from 'src/api/postApi';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import sanitizeHtml from 'sanitize-html';
import { toGermanDate } from 'src/api/format';
import BottomAction from 'src/components/BottomAction.vue';

const route = useRoute();
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

async function loadPost() {
  try {
    post.value = await getPost(id.value.toString());
    slide.value = images.value[0].id;
  } catch (error) {
    // TODO error handling
    console.log(error);
  }
}

const formattedDate = computed(() => toGermanDate(post?.value?.createdAt || ''));

onMounted(() => {
  loadPost();
});
</script>
