<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white row items-center" style="height: 60px">
      <router-view name="toolbar"></router-view>
    </q-header>

    <q-drawer
      v-if="loggedIn"
      v-model="drawerOpen"
      show-if-above
      bordered
      side="right"
    >
      <q-list separator>
        <q-item>
          <q-item-section avatar>
            <q-avatar rounded color="accent" text-color="white">
              {{ user?.username?.substring(0, 1) }}
            </q-avatar>
          </q-item-section>
          <q-item-section>{{ user?.username }}</q-item-section>
        </q-item>
        <q-separator/>
        <q-item
          clickable
          v-ripple
          to="/booking-plans"
        >
          <q-item-section>
            <q-item-label>Hallenbelegungsplan</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          @click="logout"
        >
          <q-item-section>
            <q-item-label>Abmelden</q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>
        <q-separator/>
      </q-list>
    </q-drawer>

    <q-page-container>
      <transition
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        appear
        :duration="200"
      >
        <router-view />
      </transition>
    </q-page-container>

    <q-footer>
      <div id="footer-portal">
      </div>
      <q-tabs
        dense
        class="text-black bg-white"
        indicator-color="transparent"
        active-color="primary"
      >
        <q-route-tab icon="newspaper" label="News" class="q-py-sm" to="/posts" />
        <q-route-tab icon="group" label="Teams" class="q-py-sm" to="/teams" />
        <q-route-tab icon="event" label="Termine" class="q-py-sm" to="/events" />
        <q-tab
          v-if="loggedIn"
          icon="menu"
          label="Menü"
          class="q-py-sm"
          @click="toggleDrawer"
        />
        <q-route-tab
          v-else
          icon="login"
          label="Anmeldung"
          class="q-py-sm"
          to="/login"
        />
      </q-tabs>
      </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/authStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const drawerOpen = ref(false);

const authStore = useAuthStore();
const { loggedIn, user } = storeToRefs(authStore);
const router = useRouter();

function toggleDrawer(): void {
  drawerOpen.value = !drawerOpen.value;
}

function logout() {
  authStore.doLogout();
  drawerOpen.value = false;
  router.push('/login');
}
</script>
