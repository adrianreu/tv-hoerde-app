import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {},

  }),
  getters: {
    loggedIn: (state) => !!state.user,
  },
  actions: {
  },
});
