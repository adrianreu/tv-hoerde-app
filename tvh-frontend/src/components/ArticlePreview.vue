<template>
  <div class="row q-col-gutter-md items-center">
    <div class="col-8">
      <div class="col items-stretch">
        <div class="">{{ title }}</div>
        <div class="text-grey text-caption">Von {{ author }} am {{ createdAt }}</div>

      </div>
    </div>
    <div class="col-4">
      <q-img :src="imageUrl" class="rounded-borders"></q-img>
    </div>
  </div>
</template>

<script setup lang="ts">
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
</script>
