<template>
  <q-page padding>
    <loading-wrapper :loading="loading || initialLoading">
      <div class="col q-col-gutter-md">
        <template
          v-for="post in posts"
          :key="post.id"
        >
          <article-preview
            :title="post.title"
            :image-url="post.images[0]?.formats?.small?.url || ''"
            :author="post.author?.username || ''"
            :created-at="post.createdAt"
            @click="goToDetailPage(post)"
          />
          <div>
            <q-separator ></q-separator>
          </div>
        </template>
        <div class="flex flex-center q-mb-lg">
          <div>
            <q-pagination
              v-model="page"
              :max="totalPages"
              direction-links
              :max-pages="7"
              flat
              color="grey"
              active-color="primary"
              @update:model-value="loadPageAndScroll"
            />
          </div>
        </div>
      </div>
    </loading-wrapper>
    <bottom-action>
      <q-btn flat class="full-width" icon="add" to="/post-editor/new">Neuer Beitrag</q-btn>
    </bottom-action>
  </q-page>
</template>

<script setup lang="ts">
import ArticlePreview from 'src/components/ArticlePreview.vue';
import { useRouter } from 'vue-router';
import usePagination from 'src/hooks/usePagination';
import { onMounted, ref } from 'vue';
import { Post, getPosts } from 'src/api/postApi';
import { scroll } from 'quasar';
import LoadingWrapper from 'src/components/LoadingWrapper.vue';
import BottomAction from 'src/components/BottomAction.vue';
import { usePostSearchStore } from 'src/stores/postSearchStore';
import { storeToRefs } from 'pinia';

const { setVerticalScrollPosition } = scroll;

const router = useRouter();
const postSearchStore = usePostSearchStore();

const {
  loading,
  page,
  posts,
  totalPages,
} = storeToRefs(postSearchStore);
const initialLoading = ref(true);

function goToDetailPage(post: Post) {
  router.push({ path: `/posts/${post.id}`, query: { title: post.title } });
}

async function loadPageAndScroll(nextPage?: number) {
  await postSearchStore.loadPage(nextPage);
  setVerticalScrollPosition(window, 0, 300);
  initialLoading.value = false;
}

onMounted(() => {
  loadPageAndScroll(1);
});
</script>
