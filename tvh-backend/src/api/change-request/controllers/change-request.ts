/**
 * change-request controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::change-request.change-request', ({ strapi }) => ({
  async acceptRequest(ctx) {
    try {
      ctx.body = 'ok';
    } catch (err) {
      ctx.body = err;
    }
  },
  async rejectRequest(ctx) {
    console.log(ctx);
    try {
      ctx.body = typeof ctx;
    } catch (err) {
      ctx.body = err;
    }
  },
}));
