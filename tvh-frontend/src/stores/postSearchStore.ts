import { Post, getPosts } from 'src/api/postApi';
import usePagination from 'src/hooks/usePagination';
import { Ref, ref } from 'vue';
import { defineStore } from 'pinia';

export const usePostSearchStore = defineStore('postSearchStore', () => {
  const posts = ref<Post[]>([]);
  const searchQuery = ref('');
  const teamFilter: Ref<number | null> = ref(null);
  const loading = ref(false);

  const {
    page,
    pageSize,
    totalPages,
    total,
  } = usePagination();

  pageSize.value = 10;
  async function loadPage(nextPage?: number) {
    if (nextPage) {
      page.value = nextPage;
    }
    loading.value = true;
    const query = searchQuery.value === '' ? undefined : searchQuery.value;
    const filter = teamFilter.value === null ? undefined : teamFilter.value;
    try {
      const searchResponse = await getPosts(page.value, pageSize.value, query, filter);
      page.value = searchResponse.pagination.page;
      pageSize.value = searchResponse.pagination.pageSize;
      totalPages.value = searchResponse.pagination.pageCount;
      total.value = searchResponse.pagination.total;
      posts.value = searchResponse.posts;
    } catch (error) {
      console.log(error);
      loading.value = false;
      // TODO error handling
    } finally {
      loading.value = false;
    }
  }
  return {
    posts,
    loading,
    loadPage,
    page,
    totalPages,
    searchQuery,
    teamFilter,
  };
});
