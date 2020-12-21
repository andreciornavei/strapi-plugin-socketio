'use strict';
const connections = {}

module.exports = {
  get: async (userId) => {
    return connections[userId]
  },
  set: async (userId, value) => {
    connections[userId] = value
  },
  del: async (userId) => {
    try {
      const socket = Object.keys(connections).includes(userId) ? connections[userId] : undefined
      if (socket) {
        if (strapi.io.sockets.connected[socket]) {
          strapi.io.sockets.connected[socket].disconnect();
        }
        delete connections[userId];
      }
    } catch (errror) {

    }
  },
  all: async () => {
    return connections
  }
};
