module.exports = {
  send : async (to, key, message) => {
    //to is the socket who is receive the message, must to be the USER_ID
    //key is the channel that socket will receive the message
    //message is the content that will be sent to user
    const connections = await strapi.plugins['socketio'].services.connections.all()
    if(Object.keys(connections).includes(to)){
      strapi.io.to(connections[to]).emit(key, message)
    }    
  }
}