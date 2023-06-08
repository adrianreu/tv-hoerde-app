export default {
  routes: [
    {
      method: 'POST',
      path: '/change-requests/:id/accept',
      handler: 'change-request.acceptRequest',
      config: {
        policies: [],
        middlewares: [],
      },
    },

    {
      method: 'POST',
      path: '/change-requests/:id/reject',
      handler: 'change-request.rejectRequest',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
