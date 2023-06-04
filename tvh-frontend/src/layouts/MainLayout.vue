<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white row items-center" style="height: 60px">
      <router-view name="toolbar"></router-view>
    </q-header>

    <q-drawer
      v-model="drawerOpen"
      show-if-above
      bordered
      side="right"
    >
      <div class="column full-height justify-between">
        <div class="col">
          <q-list separator>
            <q-item v-if="loggedIn">
              <q-item-section avatar>
                <q-avatar rounded color="accent" text-color="white">
                  {{ user?.firstname?.substring(0, 1) }}
                </q-avatar>
              </q-item-section>
              <q-item-section>{{ user?.firstname }} {{ user?.lastname }}</q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="col-shrink">
          <q-list separator>
            <q-separator/>
            <q-item
              v-if="loggedIn"
              clickable
              v-ripple
              to="/booking-plans"
            >
              <q-item-section>
                <q-item-label>Hallenbelegungsplan</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon name="ph-caret-right" />
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              to="/feedback"
            >
              <q-item-section>
                <q-item-label>Feedback geben</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon name="ph-caret-right" />
              </q-item-section>
            </q-item>
            <q-item
              v-if="!loggedIn"
              clickable
              v-ripple
              to="/login"
            >
              <q-item-section>
                <q-item-label>Anmelden</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon name="ph-caret-right" />
              </q-item-section>
            </q-item>
            <q-item
              v-else
              clickable
              v-ripple
              @click="logout"
            >
              <q-item-section>
                <q-item-label>Abmelden</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon name="ph-caret-right" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          appear
          :duration="200"
        >
          <component :is="Component" />
        </transition>
      </router-view>
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
        <q-route-tab icon="ph-newspaper" label="News" class="q-py-sm" to="/posts" />
        <q-route-tab icon="ph-users-three" label="Teams" class="q-py-sm" to="/teams" />
        <q-route-tab icon="ph-calendar" label="Termine" class="q-py-sm" to="/events" />
        <q-tab
          icon="ph-list"
          label="Menü"
          class="q-py-sm"
          @click="toggleDrawer"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from 'src/stores/authStore';
import { onMounted, ref } from 'vue';
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

onMounted(async () => {
  await authStore.fetchUserInformation();
});
</script>
