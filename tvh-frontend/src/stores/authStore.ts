import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { RoleType, User, login } from 'src/api/authApi';
import { getMe } from 'src/api/userApi';
import { computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const userJson = useLocalStorage('user', '{}');
  const jwt = useLocalStorage('jwt', '');

  const loggedIn = computed(() => !!jwt.value);
  const user = computed<User | null>(() => JSON.parse(userJson.value) || null);
  const userId = computed<number>(() => user.value?.id || -1);
  const userRole = computed<RoleType>(() => user.value?.role?.type || RoleType.Public);
  const userHasARole = (roles: RoleType[]) => roles.includes(userRole.value);

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

  async function doLogin(username: string, password: string) {
    try {
      const loginResponse = await login(username, password);
      userJson.value = JSON.stringify(loginResponse.user);
      jwt.value = loginResponse.jwt;
      fetchUserInformation();
    } catch (error) {
      console.log(error);
    }
  }

  function doLogout() {
    userJson.value = null;
    jwt.value = '';
  }

  return {
    user,
    jwt,
    loggedIn,
    userId,
    userRole,
    userHasARole,
    doLogin,
    doLogout,
    fetchUserInformation,
  };
});
