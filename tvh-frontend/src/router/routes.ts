import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'posts',
        name: 'News',
        components: {
          default: () => import('pages/PostsPage.vue'),
          toolbar: () => import('components/toolbars/MainToolbarWithSearch.vue'),
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
        path: 'booking-plans',
        components: {
          default: () => import('pages/BookingPlansPage.vue'),
          toolbar: () => import('components/toolbars/MainToolbar.vue'),
        },
        name: 'Belegungsplan',
      },
      {
        path: 'booking-plans/:id',
        components: {
          default: () => import('pages/BookingPlanDetailPage.vue'),
          toolbar: () => import('components/toolbars/BackToolbar.vue'),
        },
        name: 'Feldbelegung',
      },
      {
        path: 'teams/:id',
        components: {
          default: () => import('pages/TeamDetailPage.vue'),
          toolbar: () => import('components/toolbars/BackToolbar.vue'),
        },
        name: 'Mannschaft',
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
        path: 'post-editor/:id',
        components: {
          default: () => import('pages/PostEditorPage.vue'),
          toolbar: () => import('components/toolbars/BackToolbar.vue'),
        },
        name: 'Beitrageditor',
      },
      {
        path: 'event-editor/:id',
        components: {
          default: () => import('pages/EventEditorPage.vue'),
          toolbar: () => import('components/toolbars/BackToolbar.vue'),
        },
        name: 'Eventeditor',
      },
      {
        path: 'login',
        components: {
          default: () => import('pages/LoginPage.vue'),
          toolbar: () => import('components/toolbars/MainToolbar.vue'),
        },
        name: 'Anmeldung',
      },
      {
        path: 'feedback',
        components: {
          default: () => import('pages/FeedbackPage.vue'),
          toolbar: () => import('components/toolbars/MainToolbar.vue'),
        },
        name: 'Feedback',
      },
      {
        path: '',
        redirect: { path: '/posts' },
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
