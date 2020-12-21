'use strict';

module.exports = {

  find: async (ctx) => {
    // Send 200 `ok`
    const connections = Object.values(strapi.io.sockets.connected).map(socket => socket.user_id)
    const data = await strapi.query('user', 'users-permissions').find({ id_in: connections });
    ctx.send({
      connections: data.map((item) => {
        item.socket_id = Object.values(strapi.io.sockets.connected).find(socket => socket.user_id = item.id).id
        return item
      })
    });
  },
  delete: async (ctx) => {
    await strapi.plugins['socketio'].services.connections.del(ctx.params.user_id);
    ctx.status = 204
    return ctx;
  }
};