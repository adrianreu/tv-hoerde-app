import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { User, login } from 'src/api/authApi';
import { getMe } from 'src/api/userApi';
import { computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const userJson = useLocalStorage('user', '{}');
  const jwt = useLocalStorage('jwt', '');

  const loggedIn = computed(() => !!jwt.value);
  const user = computed<User | null>(() => JSON.parse(userJson.value) || null);
  // const userId = computed<number | null>(() => {
  //   if (!loggedIn.value) {
  //     return null;
  //   }
  //   try {
  //     return JSON.parse(atob(jwt.value.split('.')[1])).id;
  //   } catch (error) {
  //     console.log(error);
  //     return null;
  //   }
  // });

  async function doLogin(username: string, password: string) {
    try {
      const loginResponse = await login(username, password);
      userJson.value = JSON.stringify(loginResponse.user);
      jwt.value = loginResponse.jwt;
    } catch (error) {
      console.log(error);
    }
  }
  function doLogout() {
    userJson.value = null;
    jwt.value = '';
  }

  async function fetchUserInformation() {
    if (loggedIn.value) {
      try {
        const userInfo = await getMe();
        userJson.value = JSON.stringify(userInfo);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return {
    user,
    jwt,
    loggedIn,
    doLogin,
    doLogout,
    fetchUserInformation,
  };
});
