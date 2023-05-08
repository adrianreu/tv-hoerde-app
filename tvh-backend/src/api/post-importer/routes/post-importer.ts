export default {
  routes: [
    {
      method: 'GET',
      path: '/post-importer/start',
      handler: 'post-importer.startImport',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
