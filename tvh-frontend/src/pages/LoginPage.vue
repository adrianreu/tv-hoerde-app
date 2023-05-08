<template>
  <q-page padding>
    <q-form class="row q-col-gutter-md">
      <div class="col-12">
        <q-input
        v-model="username"
        label="E-Mail Adresse"
        outlined
        ></q-input>
      </div>
      <div class="col-12">
        <q-input v-model="password"
        outlined
        label="Passwort"
        ></q-input>
      </div>
      <div class="col-12">
        <q-btn class="full-width" color="primary" no-caps unelevated>Anmelden</q-btn>
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');
</script>
