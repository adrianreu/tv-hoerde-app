<template>
  <q-page padding>
    <q-form class="row q-col-gutter-md">
      <div class="col-12">
        <q-input
        v-model="username"
        label="E-Mail Adresse"
        outlined
        class="bg-white"
        :disable="loading"
        @keypress.enter="login"
        ></q-input>
      </div>
      <div class="col-12">
        <q-input v-model="password"
          outlined
          label="Passwort"
          :disable="loading"
          @keypress.enter="login"
          type="password"
          class="bg-white"
        ></q-input>
      </div>
      <div class="col-12">
        <q-btn
          class="full-width"
          color="primary"
          no-caps
          unelevated
          :loading="loading"
          @click="login"
        >Anmelden</q-btn>
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import useLog from 'src/hooks/useLog';
import useNotify, { NotifyType } from 'src/hooks/useNotify';
import { useAuthStore } from 'src/stores/authStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const { log } = useLog();
const { show } = useNotify();

const username = ref('');
const password = ref('');
const loading = ref(false);

async function login() {
  loading.value = true;
  try {
    await authStore.doLogin(username.value, password.value);
    loading.value = false;
    username.value = '';
    password.value = '';
    show('Erfolgreich angemeldet.', NotifyType.Success);
    router.push('/posts');
  } catch (error) {
    loading.value = false;
    show('Fehler beim Login', NotifyType.Error);
    log('LoginPage - login()', error);
  }
}
</script>
