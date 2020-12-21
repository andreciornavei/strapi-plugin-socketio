module.exports = () => {

  // ******************************************************* //
  // append socketio as a middleware to register policies    //
  // ******************************************************* //
  strapi.config.middleware.load.after.push('socketio')

  // ******************************************************************* //
  // This script attach socket.io to the server, to be used anywhere     //
  // ******************************************************************* //
  // import socket io
  const io = require('socket.io')(strapi.server);

  // listen for user connection
  io.on('connect', async function (socket) {
    try {
      const { jwt } = socket.handshake.query
      const payload = await strapi.plugins['users-permissions'].services.jwt.verify(jwt);
      // retrieve old socket with same user_id and remove it if exists
      const oldSocket = await Object.values(strapi.io.sockets.connected).find(socket => socket.user_id == payload.id)
      if (oldSocket) {
        oldSocket.disconnect()
      }
      // search for user connection by jwt payload
      const data = await strapi.query('user', 'users-permissions').findOne({ id: payload.id });
      // check if user exists
      if (!data) throw Error("User not found")
      // register user id on connected socket
      socket.user_id = payload.id
      // join user to a room called user_${id} for future use
      await socket.join(`user::${payload.id}`)
      // hook socket connection
      await strapi.plugins.socketio.config.functions.connection(socket, data)      
    } catch (error) {
      socket.disconnect()
    }
  });
  strapi.io = io; // register socket io inside strapi main object to use it globally anywhere  
  strapi.io.send = strapi.plugins.socketio.services.notification.send
  strapi.io.join = strapi.plugins.socketio.services.notification.join
};