module.exports = async (ctx, next) => {
  await next();
  // const connections = await strapi.plugins['socketio'].services.connections.all()
  // Object.keys(connections).forEach(userid => {
  //   strapi.io.to(connections[userid]).emit("hello", ctx.response.body)
  // });
};