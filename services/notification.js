module.exports = {
  join : async (userId, roomId) => {
    const connection = Object.values(strapi.io.sockets.connected).find(socket => socket.user_id = String(userId))
    if(connection) await strapi.io.sockets.connected[connection.id].join(String(roomId))
  },
  send : async (endpointId, eventKey, data) => {
    strapi.io.to(String(endpointId)).emit(String(eventKey), data)    
  }  
}