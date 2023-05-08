<template>
  <q-page>
    <q-list separator>
      <q-separator/>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-avatar fit="contain" rounded>
            <q-img src="https://tvhoerde.de/wp-content/uploads/2023/03/WhatsApp-Bild-2023-03-22-um-19.26.03.jpg"></q-img>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label caption>Dritte Liga West</q-item-label>
          <q-item-label>Herren 1</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple>
        <q-item-section>
          <q-item-label caption>Dritte Liga West</q-item-label>
          <q-item-label>Damen 1</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-icon name="chevron_right" />
        </q-item-section>
      </q-item>
      <q-separator/>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const name = route.path;
</script>
