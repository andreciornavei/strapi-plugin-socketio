'use strict';
// const redis = require('redis')
const connections = {}

module.exports = {
  get: async (userId) => {
    // const client = redis.createClient({
    //   host: "localhost",
    //   port: 6379
    // });
    // return await client.get(userId, redis.print);
    return connections[userId]
  },
  set: async (userId, value) => {
    // const client = redis.createClient({
    //   host: "localhost",
    //   port: 6379
    // });
    // return await client.set(userId, value, redis.print);
    connections[userId] = value
  },
  del: async (userId) => {
    // const client = redis.createClient({
    //   host: "localhost",
    //   port: 6379
    // });
    // return await client.del(userId, redis.print);
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
    // const client = redis.createClient({
    //   host: "localhost",
    //   port: 6379
    // });
    // const conns = await client.keys('*', redis.print);
    // return conns || [];
    return connections
  }
};
