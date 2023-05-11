import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [],
    loading: false,
    pagination: {
      totalPages: 0,
      page: 0,
      pageSize: 0,
      totalCount: 0,
    }
  }),
  getters: {
    getPosts: (state) => state.posts,
  },
  actions: {
    async fetchPosts(page: number, pageSize: number) {
      try {
        const { data } = await api.get('http://localhost:9123/api/posts/', {
          params: {
            'pagination[page]': page,
            'pagination[pageSize]': pageSize,
            'pagination[withCount]': true,
          },
        });

      } catch (error) {
        // TODO error handling
      }
    },
  },
});
