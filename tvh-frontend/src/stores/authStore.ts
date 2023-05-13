import { defineStore } from 'pinia';
import { User, login } from 'src/api/authApi';

interface RootState {
  user: User | null;
  jwt: string;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    jwt: '',
  } as RootState),
  getters: {
    loggedIn: (state) => !!state.user,
  },
  actions: {
    async doLogin(username: string, password: string) {
      try {
        const { user, jwt } = await login(username, password);
        this.user = user;
        this.jwt = jwt;
      } catch (error) {
        console.log(error);
      }
    },

    doLogout() {
      this.user = null;
      this.jwt = '';
    },
  },
});
