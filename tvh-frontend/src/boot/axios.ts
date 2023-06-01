import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from 'src/stores/authStore';
import qs from 'qs';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const authStore = useAuthStore();

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: 'http://127.0.0.1:9000',
  headers: {
    Authorization: authStore.loggedIn ? `Bearer ${authStore.jwt}` : undefined,
  },
  paramsSerializer: (params) => qs.stringify(params, {
    encodeValuesOnly: true, // prettify URL
  }),
});

export default boot(({ app, router }) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        authStore.doLogout();
        router.push('/login');
      }
      return Promise.reject(error);
    },
  );
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
