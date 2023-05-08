import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), name: 'Index' },
      { path: 'articles', component: () => import('pages/ArticlesPage.vue'), name: 'News' },
      { path: 'articles/:id', component: () => import('pages/ArticleDetailPage.vue'), name: 'Beitrag' },
      { path: 'teams', component: () => import('pages/TeamsPage.vue'), name: 'Mannschaften' },
      { path: 'events', component: () => import('pages/EventsPage.vue'), name: 'Termine' },
      { path: 'login', component: () => import('pages/LoginPage.vue'), name: 'Anmeldung' },
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
