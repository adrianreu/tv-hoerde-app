import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: { path: '/posts' },
      },
      {
        path: 'posts',
        name: 'News',
        components: {
          default: () => import('pages/PostsPage.vue'),
          toolbar: () => import('components/toolbars/MainToolbar.vue'),
        },
      },
      {
        path: 'posts/:id',
        components: {
          default: () => import('pages/PostDetailPage.vue'),
          toolbar: () => import('components/toolbars/BackToolbar.vue'),
        },
        name: 'Beitrag',
      },
      {
        path: 'teams',
        components: {
          default: () => import('pages/TeamsPage.vue'),
          toolbar: () => import('components/toolbars/MainToolbar.vue'),
        },
        name: 'Mannschaften',
      },
      {
        path: 'teams/:id',
        components: {
          default: () => import('pages/TeamDetailPage.vue'),
          toolbar: () => import('components/toolbars/BackToolbar.vue'),
        },
        name: 'Beitrag',
      },
      {
        path: 'events',
        components: {
          default: () => import('pages/EventsPage.vue'),
          toolbar: () => import('components/toolbars/MainToolbar.vue'),
        },
        name: 'Termine',
      },
      {
        path: 'login',
        components: {
          default: () => import('pages/LoginPage.vue'),
          toolbar: () => import('components/toolbars/MainToolbar.vue'),
        },
        name: 'Anmeldung',
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
