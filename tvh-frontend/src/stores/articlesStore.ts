import { defineStore } from 'pinia';

export const useArticlesStore = defineStore('news', {
  state: () => ({
    articles: [{
      id: 1,
      title: 'Mannschaft schafft den ersten Sieg',
      imageUrl: 'https://tvhoerde.de/wp-content/uploads/2023/03/WhatsApp-Bild-2023-03-22-um-19.26.03.jpg',
      author: 'Peter Ernst',
      createdAt: '27.03.2002',
    }],
  }),
  getters: {
    getArticles: (state) => state.articles,
  },
  actions: {
  },
});
