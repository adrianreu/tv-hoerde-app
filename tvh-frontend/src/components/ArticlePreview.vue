<template>
  <div class="row q-col-gutter-md">
    <div
      :class="{ 'col-8': !!imageUrl, 'col-12': !imageUrl }"
    >
    <div class="column justify-between" style="min-height: 100%">
      <div class="col-12 text-weight-bold ellipsis-2-lines">{{ cleanTitle }}</div>
      <div class="col-12 text-grey text-caption">
        {{ author }} {{ author ? '-' : '' }} {{ formattedDate }}
      </div>
    </div>
    </div>
    <div v-if="imageUrl" class="col-4">
      <q-img :ratio="4/3" :src="imageUrl" class="rounded-borders" fit="contain"></q-img>
    </div>
  </div>
</template>

<script setup lang="ts">
import { date } from 'quasar';
import { computed } from 'vue';
import sanitizeHtml from 'sanitize-html';

interface Props {
  title: string;
  imageUrl: string;
  author: string;
  createdAt: string;
}
const props = withDefaults(defineProps<Props>(), {
  title: '',
  imageUrl: '',
  author: '',
  createdAt: '',
});

const cleanTitle = computed(() => sanitizeHtml(props.title, {
  allowedTags: [],
  allowedAttributes: {},
  allowedIframeHostnames: [],
}));

const formattedDate = computed(() => date.formatDate(
  date.extractDate(props.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ'),
  'DD.MM.YYYY',
));
</script>
