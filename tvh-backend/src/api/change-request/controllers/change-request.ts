/**
 * change-request controller
 */

import { factories } from '@strapi/strapi'

const UID = 'api::change-request.change-request'

export default factories.createCoreController(UID, ({ strapi }) => ({
  async acceptRequest(ctx) {
    const changeRequestId = ctx.params.id;
    const changeRequest = await strapi.entityService.findOne(UID, changeRequestId, {
      populate: {
        requestedBy: true,
        booking: {
          populate: {
            bookedBy: true,
            bookedCourt: true,
          }
        },
      }
    })
    // change request already rejected or accepted
    if (changeRequest.status !== 'REQUESTED') {
      ctx.body = {
        "data": null,
        "error": {
          "status": 409,
          "name": "ChangeRequestStatusWrong",
          "message": "Change Request Is Already Rejected Or Accepted"
        }
      }
      ctx.status = 409;
      return;
    }
    const booking = changeRequest.booking;
    console.log(booking)

    const newBooking = {
      startTime: booking.startTime,
      endTime: booking.endTime,
      bookedCourt: booking.bookedCourt.id,
      bookedBy: booking.bookedBy.id,
      publishedAt: new Date().toISOString(),
    }

    // if change request starts after booking start time
    if (new Date(changeRequest.from) > new Date(booking.startTime)) {
      await strapi.entityService.create('api::booking.booking', {
        data: {
          ...newBooking,
          endTime: changeRequest.from,
        }
      })
    }

    // if change request ends before booking end time
    if (new Date(changeRequest.to) < new Date(booking.endTime)) {
      await strapi.entityService.create('api::booking.booking', {
        data: {
          ...newBooking,
          startTime: changeRequest.to,
        }
      })
    }

    await strapi.entityService.update('api::booking.booking', booking.id, {
      data: {
        startTime: changeRequest.from,
        endTime: changeRequest.to,
        bookedBy: changeRequest.requestedBy,
      }
    })
    return strapi.entityService.update(UID, changeRequestId, {
      data: {
        status: 'ACCEPTED',
      }
    });
  },
  async rejectRequest(ctx) {
    const changeRequestId = ctx.params.id;
    const changeRequest = await strapi.entityService.findOne(UID, changeRequestId)
    // change request already rejected or accepted
    if (changeRequest.status !== 'REQUESTED') {
      ctx.body = {
        "data": null,
        "error": {
          "status": 409,
          "name": "ChangeRequestStatusWrong",
          "message": "Change Request Is Already Rejected Or Accepted"
        }
      }
      ctx.status = 409;
      return;
    }
    return strapi.entityService.update(UID, changeRequestId, {
      data: {
        status: 'REJECTED',
      }
    });
  },
}));
