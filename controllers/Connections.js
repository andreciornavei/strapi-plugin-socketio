'use strict';

module.exports = {
  find: async (ctx) => {
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
    const connection = Object.values(strapi.io.sockets.connected).find(socket => socket.user_id == ctx.params.user_id)
    if (connection) connection.disconnect()
    return ctx.send();
  }
};