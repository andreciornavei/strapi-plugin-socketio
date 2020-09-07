'use strict';

module.exports = {

  find: async (ctx) => {
    // Send 200 `ok`
    const connections = await strapi.plugins['socketio'].services.connections.all();
    const data = await strapi.query('user', 'users-permissions').find({ id: { $in: Object.keys(connections) } });
    ctx.send({
      connections: data.map((item) => {
        item.socket_id = connections[item.id]
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