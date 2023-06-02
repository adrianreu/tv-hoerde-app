<template>
  <div class="row q-col-gutter-md">
    <div
      :class="{ 'col-8': !!imageUrl, 'col-12': !imageUrl }"
    >
    <div class="column justify-between" style="min-height: 100%">
      <div class="col-12 text-weight-bold ellipsis-2-lines">{{ cleanTitle }}</div>
      <div class="col-12 text-grey text-caption">
        {{ formattedAuthor }} {{ formattedAuthor ? '-' : '' }} {{ formattedDate }}
      </div>
    </div>
    </div>
    <div v-if="imageUrl" class="col-4">
      <q-img :ratio="6/4" :src="imageUrl" class="rounded-borders" fit="cover"></q-img>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import sanitizeHtml from 'sanitize-html';
import { toGermanDate } from 'src/api/format';

interface Props {
  title: string;
  imageUrl: string;
  author: {
    firstname?: string;
    lastname?: string;
  };
  createdAt: string;
}
const props = withDefaults(defineProps<Props>(), {
  title: '',
  imageUrl: '',
  author: () => ({}),
  createdAt: '',
});

const cleanTitle = computed(() => sanitizeHtml(props.title, {
  allowedTags: [],
  allowedAttributes: {},
  allowedIframeHostnames: [],
}));

const formattedDate = computed(() => toGermanDate(props.createdAt));
const formattedAuthor = computed(
  () => (props.author.firstname && props.author.lastname
    ? `${props.author.firstname} ${props.author.lastname}` : ''),
);
</script>
