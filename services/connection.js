'use strict'

module.exports = {
  disconnect: async (userId) => {
    try {
      const connection = Object.values(strapi.io.sockets.connected).find(socket => socket.user_id == userId)
      if (connection) connection.disconnect()
      return true
    } catch (error) {
      return false
    }
  }
}