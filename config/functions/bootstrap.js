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
  io.on('connection', async function (socket) {
    try {
      const { jwt } = socket.handshake.query
      const payload = await strapi.plugins['users-permissions'].services.jwt.verify(jwt);
      const connection = await strapi.plugins['socketio'].services.connections.get(payload.id);
      if (connection) {
        // user_id already defined, redefine socket connection
        console.log("Disconnecting old user:", payload.id)
        io.to(connection).disconnect()
      }
      // search for user connection by jwt payload
      const data = await strapi.query('user', 'users-permissions').findOne({ id: payload.id });
      // check if user exists
      if (!data) throw Error("User not found")
      // register connection on global variable access
      await strapi.plugins['socketio'].services.connections.set(payload.id, socket.id);
      // new connection registered
      console.log('Client connectet:', payload.id, "::", socket.id)
      // listen for user diconnect
      socket.on('disconnect', async () => {
        console.log('The user', payload.id, 'was disconnected')
        await strapi.plugins['socketio'].services.connections.del(payload.id);
      });
    } catch (error) {
      // console.log("socket error connection ->", error)
      socket.disconnect()
    }
  });
  strapi.io = io; // register socket io inside strapi main object to use it globally anywhere  

};