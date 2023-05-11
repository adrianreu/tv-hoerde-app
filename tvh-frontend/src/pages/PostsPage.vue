<template>
  <q-page padding>
    <loading-wrapper :loading="loading">
      <div class="col q-col-gutter-md">
        <template
          v-for="post in posts"
          :key="post.id"
        >
          <article-preview
            :title="post.title"
            :image-url="post.images[0]?.formats?.small?.url || ''"
            :author="post.author?.name || ''"
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
              @update:model-value="loadPage"
            />
          </div>
        </div>
      </div>
    </loading-wrapper>
  </q-page>
</template>

<script setup lang="ts">
import ArticlePreview from 'src/components/ArticlePreview.vue';
import { useRouter } from 'vue-router';
import usePagination from 'src/hooks/usePagination';
import { onMounted, ref } from 'vue';
import { Post, getPosts } from 'src/api/postApi';
import { scroll, useQuasar } from 'quasar';
import LoadingWrapper from 'src/components/LoadingWrapper.vue';

const { setVerticalScrollPosition } = scroll;

const router = useRouter();
const posts = ref<Post[]>([]);
const loading = ref(false);

const {
  page,
  pageSize,
  totalPages,
  total,
  toStrapiPagination,
} = usePagination();

pageSize.value = 10;

function goToDetailPage(post: Post) {
  router.push({ path: `/posts/${post.id}`, query: { title: post.title } });
}

async function loadPage(nextPage?: number) {
  if (nextPage) {
    page.value = nextPage;
  }
  try {
    loading.value = true;
    const searchResponse = await getPosts(toStrapiPagination.value);
    page.value = searchResponse.pagination.page;
    pageSize.value = searchResponse.pagination.pageSize;
    totalPages.value = searchResponse.pagination.pageCount;
    total.value = searchResponse.pagination.total;
    posts.value = searchResponse.posts;

    setVerticalScrollPosition(window, 0, 300);
  } catch (error) {
    console.log(error);
    // TODO error handling
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadPage(1);
});
</script>