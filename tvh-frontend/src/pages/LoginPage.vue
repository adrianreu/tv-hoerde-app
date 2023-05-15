<template>
  <q-page padding>
    <loading-wrapper :loading="loading">
      <q-form class="row q-col-gutter-md">
        <div class="col-12">
          <q-input
          v-model="username"
          label="E-Mail Adresse"
          outlined
          class="bg-white"
          @keypress.enter="login"
          ></q-input>
        </div>
        <div class="col-12">
          <q-input v-model="password"
            outlined
            label="Passwort"
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
            @click="login"
          >Anmelden</q-btn>
        </div>
      </q-form>
    </loading-wrapper>
  </q-page>
</template>

<script setup lang="ts">
import LoadingWrapper from 'src/components/LoadingWrapper.vue';
import { useAuthStore } from 'src/stores/authStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const username = ref('');
const password = ref('');
const loading = ref(false);

async function login() {
  loading.value = true;
  await authStore.doLogin(username.value, password.value);
  loading.value = false;
  username.value = '';
  password.value = '';
  router.push('/posts');
}
</script>
