module.exports = {
  join : async (userId, roomId) => {
    const connections = await strapi.plugins['socketio'].services.connections.all()
    if(Object.keys(connections).includes(String(userId))){
      strapi.io.sockets.connected[connections[String(userId)]].join(roomId)
    }    
  },
  send : async (endpointId, eventKey, data) => {
    //endpointId could be the userId or a created Room
    strapi.io.to(endpointId).emit(eventKey, data)    
  }  
}