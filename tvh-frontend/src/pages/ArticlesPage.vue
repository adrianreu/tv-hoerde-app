<template>
  <q-page padding>
    <div class="col q-col-gutter-md">
      <article-preview
      v-for="article in articles"
      :key="article.id"
      v-bind="article"
      @click="goToDetailPage(article.id.toString())"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import ArticlePreview from 'src/components/ArticlePreview.vue';
import { useArticlesStore } from 'src/stores/articlesStore';
import { useRouter } from 'vue-router';

const store = useArticlesStore();
const router = useRouter();
const { articles } = store;

const goToDetailPage = (id: string) => {
  router.push(`/articles/${id}`);
};
</script>
